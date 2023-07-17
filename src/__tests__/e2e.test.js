const { describe, it, beforeEach } = require("node:test");
const { mock } = require("node:test");
const assert = require("node:assert").strict;
const main = require("../../index");
const {
  setupMswServer,
  listIssuesForRepoMswRequestHandler,
  listCommitsForVetsWebsiteMswRequestHandler,
  listCommitsForVetsApiMswRequestHandler,
} = require("./helpers");
const { createOnboarder } = require("./factories");
const {
  createGitHubOnboardingIssueDto,
} = require("../github/__tests__/factories");
const { createCommitDto } = require("../commit/__tests__/factories");
const { createRosterMemberDto } = require("../roster/__tests__/factories");

describe("happy path", () => {
  const server = setupMswServer();

  describe("using the GitHub onboarding template issue as an onboarder source", () => {
    beforeEach(() => {
      const gitHubOnboardingIssueDto = createGitHubOnboardingIssueDto({
        body: "GitHub handle*: octocat\n",
        created_at: "2023-07-01T00:00:00Z",
      });
      const onboarder = createOnboarder({
        gitHubHandle: "octocat",
        onboardingStart: new Date(gitHubOnboardingIssueDto.created_at),
      });
      server.use(
        listIssuesForRepoMswRequestHandler([gitHubOnboardingIssueDto]),
        listCommitsForVetsWebsiteMswRequestHandler(onboarder, [
          createCommitDto({
            commit: {
              author: {
                date: "2023-07-05T00:00:00Z",
              },
            },
          }),
          createCommitDto({
            commit: {
              author: {
                date: "2023-07-04T00:00:00Z",
              },
            },
          }),
        ]),
        listCommitsForVetsApiMswRequestHandler(onboarder, []),
      );
    });

    it("logs the mean time to first commit", async () => {
      const consoleSpy = mock.method(console, "log");
      const roster = [];

      await main(roster);

      assert.notEqual(consoleSpy.mock.callCount(), 0);
      assert.ok(
        consoleSpy.mock.calls.some((call) =>
          call.arguments.includes(
            "Mean Time to First Commit based on GitHub Onboarding Issues (days): 3.00",
          ),
        ),
      );
    });
  });

  describe("using the roster as an onboarder source", () => {
    const roster = [
      createRosterMemberDto({
        gitHubHandle: "some-other-user",
        onboardingStart: "2023-07-01T00:00:00Z",
      }),
    ];

    beforeEach(() => {
      const onboarder = createOnboarder({
        gitHubHandle: "some-other-user",
        onboardingStart: new Date("2023-07-01T00:00:00Z"),
      });
      server.use(
        listIssuesForRepoMswRequestHandler([]),
        listCommitsForVetsWebsiteMswRequestHandler(onboarder, []),
        listCommitsForVetsApiMswRequestHandler(onboarder, [
          createCommitDto({
            commit: {
              author: {
                date: "2023-07-14T00:00:00Z",
              },
            },
          }),
        ]),
      );
    });

    it("logs the mean time to first commit", async () => {
      const consoleSpy = mock.method(console, "log");

      await main(roster);

      assert.notEqual(consoleSpy.mock.callCount(), 0);
      assert.ok(
        consoleSpy.mock.calls.some((call) =>
          call.arguments.includes(
            "Mean Time to First Commit based on Roster (days): 13.00",
          ),
        ),
      );
    });
  });
});
