const DaysToFirstCommitCollector = require("../DaysToFirstCommitCollector");
const FirstCommitFinder = require("../FirstCommitFinder");
const { createOnboarder } = require("../../__tests__/factories");

jest.mock("../FirstCommitFinder");

describe("DaysToFirstCommitCollector", () => {
  describe("collect", () => {
    it("returns an array of first time to commit in days", async () => {
      const firstCommitFinder = new FirstCommitFinder();
      firstCommitFinder.find
        .mockResolvedValueOnce(new Date("2023-07-04T00:00:00Z"))
        .mockResolvedValueOnce(new Date("2023-07-05T00:00:00Z"));
      const daysToFirstCommitCollector = new DaysToFirstCommitCollector(
        firstCommitFinder
      );
      const onboarders = [
        createOnboarder({
          onboardingStart: new Date("2023-07-01T00:00:00Z"),
        }),
      ];

      const daysToFirstCommit = await daysToFirstCommitCollector.collect(
        onboarders
      );

      expect(daysToFirstCommit).toEqual([3]);
    });

    it("returns an empty array when no commits are found", async () => {
      const firstCommitFinder = new FirstCommitFinder();
      firstCommitFinder.find.mockResolvedValue(null);
      const daysToFirstCommitCollector = new DaysToFirstCommitCollector(
        firstCommitFinder
      );
      const onboarders = [
        createOnboarder({
          onboardingStart: new Date("2023-07-01T00:00:00Z"),
        }),
      ];

      const daysToFirstCommit = await daysToFirstCommitCollector.collect(
        onboarders
      );

      expect(daysToFirstCommit).toEqual([]);
    });
  });
});
