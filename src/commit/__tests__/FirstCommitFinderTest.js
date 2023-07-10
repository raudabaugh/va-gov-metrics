const { Octokit } = require("octokit");
const {
  setupMswServer,
  listCommitsForVetsApiMswRequestHandler,
} = require("../../__tests__/helpers");
const FirstCommitDateFinder = require("../FirstCommitDateFinder");
const { createCommit } = require("./factories");

describe("FirstCommitDateFinder", () => {
  const server = setupMswServer();

  describe("findFirstCommit", () => {
    const firstCommitDateFinder = new FirstCommitDateFinder(new Octokit());

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
        ]),
      );

      const firstCommit = await firstCommitDateFinder.find("vets-api", {});

      expect(firstCommit).toEqual(new Date(date));
    });

    it("returns null when there is no first commit", async () => {
      server.use(listCommitsForVetsApiMswRequestHandler([]));

      const firstCommit = await firstCommitDateFinder.find("vets-api", {});

      expect(firstCommit).toBeNull();
    });
  });
});
