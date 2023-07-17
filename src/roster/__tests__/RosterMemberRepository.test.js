import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import RosterMemberRepository from "../RosterMemberRepository.js";
import { createOnboarder } from "../../__tests__/factories.js";
import { createRosterMemberDto } from "./factories.js";

describe("RosterMemberRepository", () => {
  describe("findAll", () => {
    it("returns onboarders created from the roster JSON file", async () => {
      const roster = [
        createRosterMemberDto({
          gitHubHandle: "octocat",
          onboardingStart: "2023-07-01T00:00:00Z",
        }),
      ];
      const rosterMemberRepository = new RosterMemberRepository(roster);

      const onboarders = await rosterMemberRepository.findAll();

      assert.deepEqual(onboarders, [
        createOnboarder({
          gitHubHandle: "octocat",
          onboardingStart: new Date("2023-07-01T00:00:00Z"),
        }),
      ]);
    });
  });
});
