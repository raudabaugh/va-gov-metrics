const { Octokit } = require("octokit");
const {
  setupMswServer,
  listCommitsForVetsApiMswRequestHandler,
} = require("./helpers");
const FirstCommitFinder = require("../FirstCommitFinder");
const { createCommit } = require("./factories");

describe("FirstCommitFinder", () => {
  describe("findFirstCommit", () => {
    const server = setupMswServer();
    const firstCommitFinder = new FirstCommitFinder(new Octokit());

    it("returns the oldest commit date", async () => {
      const date = "2023-07-04T00:00:00Z";
      server.use(
        listCommitsForVetsApiMswRequestHandler([
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
                date,
              },
            },
          }),
        ])
      );

      const firstCommit = await firstCommitFinder.find("vets-api", {});

      expect(firstCommit).toEqual(new Date(date));
    });

    it("returns null when there is no first commit", async () => {
      server.use(listCommitsForVetsApiMswRequestHandler([]));

      const firstCommit = await firstCommitFinder.find("vets-api", {});

      expect(firstCommit).toBeNull();
    });
  });
});
