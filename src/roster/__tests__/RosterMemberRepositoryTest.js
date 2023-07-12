const RosterMember = require("../RosterMember");
const RosterMemberRepository = require("../RosterMemberRepository");
const { createOnboarder } = require("../../__tests__/factories");

jest.mock("../roster.json", () => [
  {
    gitHubHandle: "octocat",
    onboardingStart: "2023-07-01T00:00:00Z",
  },
]);
jest.mock("../RosterMember");

describe("RosterMemberRepository", () => {
  describe("findAll", () => {
    const onboarder = createOnboarder();

    beforeEach(() => {
      RosterMember.mockImplementation(() => ({
        toOnboarder: jest.fn().mockReturnValue(onboarder),
      }));
    });

    it("returns onboarders created from the roster JSON file", async () => {
      const rosterMemberRepository = new RosterMemberRepository();

      const onboarders = await rosterMemberRepository.findAll();

      expect(onboarders).toEqual([onboarder]);
    });
  });
});
