const DaysToFirstCommitReducer = require("../DaysToFirstCommitReducer");
const FirstCommitDateFinder = require("../FirstCommitDateFinder");
const { createOnboarder } = require("../../__tests__/factories");

jest.mock("../FirstCommitDateFinder");

describe("DaysToFirstCommitReducer", () => {
  describe("collect", () => {
    it("returns the first time to commit in days", async () => {
      const firstCommitDateFinder = new FirstCommitDateFinder();
      firstCommitDateFinder.find
        .mockResolvedValueOnce(new Date("2023-07-04T00:00:00Z"))
        .mockResolvedValueOnce(new Date("2023-07-05T00:00:00Z"));
      const daysToFirstCommitReducer = new DaysToFirstCommitReducer(
        firstCommitDateFinder
      );
      const onboarder = createOnboarder({
        onboardingStart: new Date("2023-07-01T00:00:00Z"),
      });

      const daysToFirstCommit = await daysToFirstCommitReducer.reduce(
        onboarder
      );

      expect(daysToFirstCommit).toEqual(3);
    });

    it("returns null when no commits are found", async () => {
      const firstCommitDateFinder = new FirstCommitDateFinder();
      firstCommitDateFinder.find.mockResolvedValue(null);
      const daysToFirstCommitReducer = new DaysToFirstCommitReducer(
        firstCommitDateFinder
      );
      const onboarder = createOnboarder({
        onboardingStart: new Date("2023-07-01T00:00:00Z"),
      });

      const daysToFirstCommit = await daysToFirstCommitReducer.reduce(
        onboarder
      );

      expect(daysToFirstCommit).toBeNull();
    });
  });
});
