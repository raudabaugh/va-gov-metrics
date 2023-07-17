import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { Octokit } from "@octokit/rest";
import {
  setupMswServer,
  listCommitsForVetsApiMswRequestHandler,
} from "../../__tests__/helpers.js";
import CommitRepository from "../CommitRepository.js";
import { createCommitDto, createCommit } from "./factories.js";
import { createOnboarder } from "../../__tests__/factories.js";

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

      assert.deepEqual(
        firstCommit,
        createCommit({ date: new Date(commits[1].commit.author.date) }),
      );
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
