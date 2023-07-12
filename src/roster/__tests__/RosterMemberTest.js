const { createOnboarder } = require("../../__tests__/factories");
const { createRosterMember } = require("./factories");

describe("RosterMember", () => {
  describe("toOnboarder", () => {
    it("converts itself into an Onboarder", () => {
      const rosterMember = createRosterMember();

      const onboarder = rosterMember.toOnboarder();

      expect(onboarder).toEqual(
        createOnboarder({
          gitHubHandle: rosterMember.gitHubHandle,
          onboardingStart: new Date(rosterMember.onboardingStart),
        }),
      );
    });
  });
});
