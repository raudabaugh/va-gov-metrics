import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import RosterMemberRepository from "./RosterMemberRepository.js";
import { createOnboarder } from "../factories.js";
import { createRosterMemberDto } from "./factories.js";

describe("RosterMemberRepository", () => {
  describe("findAll", () => {
    it("returns onboarders created from a given roster", async () => {
      const rosterMember = createRosterMemberDto({
        gitHubHandle: "octocat",
        onboardingStart: "2023-07-01T00:00:00Z",
      });
      const roster = [rosterMember];
      const rosterMemberRepository = new RosterMemberRepository(roster);

      const onboarders = await rosterMemberRepository.findAll();

      assert.deepEqual(onboarders, [
        createOnboarder({
          gitHubHandle: rosterMember.gitHubHandle,
          onboardingStart: new Date(rosterMember.onboardingStart),
        }),
      ]);
    });
  });
});
