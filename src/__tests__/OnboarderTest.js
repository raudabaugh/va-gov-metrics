const { createOnboarder } = require("./factories");

describe("Onboarder", () => {
  describe("daysToFirstCommit", () => {
    it("returns the first time to commit in days", () => {
      const possibleCommitDates = [
        new Date("2023-07-04T00:00:00Z"),
        new Date("2023-07-05T00:00:00Z"),
      ];
      const onboarder = createOnboarder({
        onboardingStart: new Date("2023-07-01T00:00:00Z"),
      });

      const daysToFirstCommit =
        onboarder.daysToFirstCommit(possibleCommitDates);

      expect(daysToFirstCommit).toEqual(3);
    });

    it("returns null when no commits are found", () => {
      const onboarder = createOnboarder();

      const possibleCommits = [null];
      const daysToFirstCommit = onboarder.daysToFirstCommit(possibleCommits);

      expect(daysToFirstCommit).toBeNull();
    });
  });
});
