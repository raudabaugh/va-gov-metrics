const { Octokit } = require("@octokit/rest");
const {
  setupMswServer,
  listCommitsForVetsApiMswRequestHandler,
} = require("../../__tests__/helpers");
const CommitRepository = require("../CommitRepository");
const { createCommit, createGitHubCommit } = require("./factories");
const { createOnboarder } = require("../../__tests__/factories");

describe("CommitRepository", () => {
  const server = setupMswServer();

  describe("findFirstCommit", () => {
    const commitRepository = new CommitRepository(new Octokit());

    it("returns the first commit", async () => {
      const onboarder = createOnboarder();
      const commits = [
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
      ];
      server.use(listCommitsForVetsApiMswRequestHandler(onboarder, commits));

      const firstCommit = await commitRepository.findFirstCommit(
        "vets-api",
        onboarder,
      );

      expect(firstCommit).toEqual(
        createGitHubCommit({ date: new Date(commits[1].commit.author.date) }),
      );
    });

    it("returns null when there is no first commit", async () => {
      const onboarder = createOnboarder();
      server.use(listCommitsForVetsApiMswRequestHandler(onboarder, []));

      const firstCommit = await commitRepository.findFirstCommit(
        "vets-api",
        onboarder,
      );

      expect(firstCommit).toBeNull();
    });
  });
});
