import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { Octokit } from "@octokit/rest";
import { setupMswServer, listCommitsForVetsApi } from "../msw-helpers.js";
import CommitRepository from "./CommitRepository.js";
import { createCommitDto, createCommit } from "./factories.js";
import { createOnboarder } from "../factories.js";

describe("CommitRepository", () => {
  const server = setupMswServer();

  describe("findFirstBy", () => {
    const commitRepository = new CommitRepository(new Octokit());

    it("returns the first commit for an oboarder in a repo", async () => {
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
      server.use(listCommitsForVetsApi(onboarder, commits));

      const firstCommit = await commitRepository.findFirstBy(
        "vets-api",
        onboarder
      );

      assert.deepEqual(
        firstCommit,
        createCommit({ date: new Date(commits[1].commit.author.date) })
      );
    });

    it("returns null when the onboarder has no commits in the repo", async () => {
      const onboarder = createOnboarder();
      server.use(listCommitsForVetsApi(onboarder, []));

      const firstCommit = await commitRepository.findFirstBy(
        "vets-api",
        onboarder
      );

      assert.equal(firstCommit, null);
    });
  });
});
