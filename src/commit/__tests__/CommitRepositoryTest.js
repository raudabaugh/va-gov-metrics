const { Octokit } = require("@octokit/rest");
const {
  setupMswServer,
  listCommitsForVetsApiMswRequestHandler,
} = require("../../__tests__/helpers");
const CommitRepository = require("../CommitRepository");
const { createCommit } = require("./factories");
const { createOnboarder } = require("../../__tests__/factories");

describe("CommitRepository", () => {
  const server = setupMswServer();

  describe("findFirstCommit", () => {
    const commitRepository = new CommitRepository(new Octokit());

    it("returns the oldest commit date", async () => {
      const onboarder = createOnboarder();
      const date = "2023-07-04T00:00:00Z";
      server.use(
        listCommitsForVetsApiMswRequestHandler(onboarder, [
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

      const firstCommitDate = await commitRepository.findFirstCommit(
        "vets-api",
        onboarder,
      );

      expect(firstCommitDate).toEqual(new Date(date));
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
