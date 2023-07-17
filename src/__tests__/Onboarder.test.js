import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { createCommit } from "../commit/__tests__/factories.js";
import { createOnboarder } from "./factories.js";

describe("Onboarder", () => {
  describe("daysToFirstCommit", () => {
    it("returns the first time to commit in days", () => {
      const possibleFirstCommits = [
        createCommit({
          date: new Date("2023-07-04T00:00:00Z"),
        }),
        createCommit({
          date: new Date("2023-07-05T00:00:00Z"),
        }),
      ];
      const onboarder = createOnboarder({
        onboardingStart: new Date("2023-07-01T00:00:00Z"),
      });

      const daysToFirstCommit =
        onboarder.daysToFirstCommit(possibleFirstCommits);

      assert.equal(daysToFirstCommit, 3);
    });

    it("returns null when no commits are found", () => {
      const onboarder = createOnboarder();
      const possibleCommits = [];

      const daysToFirstCommit = onboarder.daysToFirstCommit(possibleCommits);

      assert.equal(daysToFirstCommit, null);
    });
  });
});
