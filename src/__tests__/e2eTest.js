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

jest.mock("../roster/roster.json", () => [
  {
    gitHubHandle: "some-other-user",
    onboardingStart: "2023-07-01T00:00:00Z",
  },
]);

describe("happy path", () => {
  const server = setupMswServer();

  describe("using the GitHub onboarding template issue as an onboarder source", () => {
    beforeEach(() => {
      const onboardingIssueDto = createGitHubOnboardingIssueDto({
        body: "GitHub handle*: octocat\n",
        created_at: "2023-07-01T00:00:00Z",
      });
      const onboarder = createOnboarder({
        gitHubHandle: "octocat",
        onboardingStart: new Date(onboardingIssueDto.created_at),
      });
      server.use(
        listIssuesForRepoMswRequestHandler([onboardingIssueDto]),
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
      const consoleSpy = jest.spyOn(console, "log");

      await main();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Mean Time to First Commit based on GitHub Onboarding Issues: 3.00 days",
      );
    });
  });

  describe("using the roster as an onboarder source", () => {
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
      const consoleSpy = jest.spyOn(console, "log");

      await main();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Mean Time to First Commit based on Roster: 13.00 days",
      );
    });
  });
});
