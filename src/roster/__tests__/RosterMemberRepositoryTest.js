const assert = require("node:assert").strict;
const RosterMemberRepository = require("../RosterMemberRepository");
const { createOnboarder } = require("../../__tests__/factories");

jest.mock("../roster.json", () => [
  {
    gitHubHandle: "octocat",
    onboardingStart: "2023-07-01T00:00:00Z",
  },
]);

describe("RosterMemberRepository", () => {
  describe("findAll", () => {
    it("returns onboarders created from the roster JSON file", async () => {
      const rosterMemberRepository = new RosterMemberRepository();

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
