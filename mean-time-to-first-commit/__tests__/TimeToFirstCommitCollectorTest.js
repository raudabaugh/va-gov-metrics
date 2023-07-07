const TimeToFirstCommitCollector = require("../TimeToFirstCommitCollector");
const FirstCommitFinder = require("../FirstCommitFinder");
const { createOnboarder } = require("./factories");

jest.mock("../FirstCommitFinder");

describe("TimeToFirstCommitCollector", () => {
  describe("collect", () => {
    it("returns an array of first time to commit in days", async () => {
      const firstCommitFinder = new FirstCommitFinder();
      firstCommitFinder.findFirstCommit
        .mockResolvedValueOnce(new Date("2023-07-04T00:00:00Z"))
        .mockResolvedValueOnce(new Date("2023-07-05T00:00:00Z"));
      const timeToFirstCommitCollector = new TimeToFirstCommitCollector(
        firstCommitFinder
      );
      const onboarders = [
        createOnboarder({
          onboardingStart: "2023-07-01T00:00:00Z",
        }),
      ];

      const daysToFirstCommit = await timeToFirstCommitCollector.collect(
        onboarders
      );

      expect(daysToFirstCommit).toEqual([3]);
    });

    it("returns an empty array when no commits are found", async () => {
      const firstCommitFinder = new FirstCommitFinder();
      firstCommitFinder.findFirstCommit
        .mockResolvedValueOnce(new Date(undefined))
        .mockResolvedValueOnce(new Date(undefined));
      const timeToFirstCommitCollector = new TimeToFirstCommitCollector(
        firstCommitFinder
      );
      const onboarders = [
        createOnboarder({
          onboardingStart: "2023-07-01T00:00:00Z",
        }),
      ];

      const daysToFirstCommit = await timeToFirstCommitCollector.collect(
        onboarders
      );

      expect(daysToFirstCommit).toEqual([]);
    });
  });
});
