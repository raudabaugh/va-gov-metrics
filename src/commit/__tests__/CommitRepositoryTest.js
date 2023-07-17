const assert = require("node:assert").strict;
const { Octokit } = require("@octokit/rest");
const {
  setupMswServer,
  listCommitsForVetsApiMswRequestHandler,
} = require("../../__tests__/helpers");
const CommitRepository = require("../CommitRepository");
const { createCommitDto, createCommit } = require("./factories");
const { createOnboarder } = require("../../__tests__/factories");

describe("CommitRepository", () => {
  const server = setupMswServer();

  describe("findFirstBy", () => {
    const commitRepository = new CommitRepository(new Octokit());

    it("returns the first commit", async () => {
      const onboarder = createOnboarder();
      const commits = [
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
      ];
      server.use(listCommitsForVetsApiMswRequestHandler(onboarder, commits));

      const firstCommit = await commitRepository.findFirstBy(
        "vets-api",
        onboarder,
      );

      assert.deepEqual(firstCommit, createCommit({ date: new Date(commits[1].commit.author.date) }));
    });

    it("returns null when there is no first commit", async () => {
      const onboarder = createOnboarder();
      server.use(listCommitsForVetsApiMswRequestHandler(onboarder, []));

      const firstCommit = await commitRepository.findFirstBy(
        "vets-api",
        onboarder,
      );

      assert.equal(firstCommit, null);
    });
  });
});
