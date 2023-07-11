const main = require("../../index");
const {
  setupMswServer,
  listIssuesForRepoMswRequestHandler,
  listCommitsForVetsWebsiteMswRequestHandler,
  listCommitsForVetsApiMswRequestHandler,
} = require("./helpers");
const { createOnboarder } = require("./factories");
const {
  createOnboardingTemplateIssue,
} = require("../github/__tests__/factories");
const { createCommit } = require("../commit/__tests__/factories");

describe("happy path", () => {
  const server = setupMswServer();

  beforeEach(() => {
    const onboardingTemplateIssue = createOnboardingTemplateIssue({
      body: "GitHub handle*: octocat\n",
      created_at: "2023-07-01T00:00:00Z",
    });
    const onboarder = createOnboarder({
      gitHubHandle: "octocat",
      onboardingStart: new Date(onboardingTemplateIssue.created_at),
    });
    server.use(
      listIssuesForRepoMswRequestHandler([onboardingTemplateIssue]),
      listCommitsForVetsWebsiteMswRequestHandler(onboarder, [
        createCommit({
          commit: {
            author: {
              date: "2023-07-05T00:00:00Z",
            },
          },
        }),
        createCommit({
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

  it("calculates the mean time to commit", async () => {
    const consoleSpy = jest.spyOn(console, "log");

    await main();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Mean Time to First Commit: 3.00 days",
    );
  });
});
