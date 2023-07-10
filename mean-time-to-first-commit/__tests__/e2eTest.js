const main = require("../../index");
const { rest } = require("msw");
const {
  setupMswServer,
  GITHUB_URI,
  listIssuesForRepoMswRequestHandler,
  listCommitsForVetsWebsiteMswRequestHandler,
  listCommitsForVetsApiMswRequestHandler,
} = require("./helpers");
const { createOnboardingTemplateIssue, createCommit } = require("./factories");

const server = setupMswServer();

describe("happy path", () => {
  beforeEach(() => {
    server.use(
      listIssuesForRepoMswRequestHandler([
        createOnboardingTemplateIssue({
          body: "GitHub handle*: octocat\n",
          created_at: "2023-07-01T00:00:00Z",
        }),
      ]),
      listCommitsForVetsWebsiteMswRequestHandler([
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
      listCommitsForVetsApiMswRequestHandler([])
    );
  });

  it("calculates the mean time to commit", async () => {
    const consoleSpy = jest.spyOn(console, "log");

    await main();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Mean Time to First Commit: 3.00 days"
    );
  });
});
