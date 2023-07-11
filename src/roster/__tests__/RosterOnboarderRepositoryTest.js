const RosterOnboarderRepository = require("../RosterOnboarderRepository");

jest.mock("../roster.json", () => [
  {
    gitHubHandle: "octocat",
    onboardingStart: "2023-07-01T00:00:00Z",
  },
]);

describe("RosterOnboarderRepository", () => {
  describe("findAll", () => {
    it("returns the array of onboarders from the roster json file", async () => {
      const rosterOnboarderRepository = new RosterOnboarderRepository();

      const onboarders = await rosterOnboarderRepository.findAll();

      expect(onboarders).toEqual([
        {
          gitHubHandle: "octocat",
          onboardingStart: new Date("2023-07-01T00:00:00Z"),
        },
      ]);
    });
  });
});
