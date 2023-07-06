const MeanTimeToFirstCommitCalculator = require("../MeanTimeToFirstCommitCalculator");
const {
  createOnboardingTemplateIssue,
  createOnboarder,
} = require("./factories");

describe("MeanTimeToFirstCommitCalculator", () => {
  describe(".calcuate", () => {
    it("returns the mean time to first commit", async () => {
      const onboardingTemplateIssue = createOnboardingTemplateIssue({
        created_at: "2023-07-01T00:00:00Z",
      });
      const onboardingTemplateIssueFinder = {
        findAll: jest.fn().mockReturnValue([onboardingTemplateIssue]),
      };
      const onboarderMapper = {
        map: jest.fn().mockReturnValue([
          createOnboarder({
            onboardingStart: onboardingTemplateIssue.created_at,
          }),
        ]),
      };
      const timeToFirstCommitCollector = {
        collect: jest.fn().mockReturnValue([3]),
      };
      const meanTimeToFirstCommitCalculator =
        new MeanTimeToFirstCommitCalculator(
          onboardingTemplateIssueFinder,
          onboarderMapper,
          timeToFirstCommitCollector
        );

      const meanTimeToFirstCommit =
        await meanTimeToFirstCommitCalculator.calculate();

      expect(meanTimeToFirstCommit).toEqual(3);
    });

    it("returns zero when there's no onboarders", async () => {
      const onboardingTemplateIssueFinder = {
        findAll: jest.fn().mockReturnValue([]),
      };
      const onboarderMapper = {
        map: jest.fn().mockReturnValue([]),
      };
      const timeToFirstCommitCollector = {
        collect: jest.fn().mockReturnValue([]),
      };
      const meanTimeToFirstCommitCalculator =
        new MeanTimeToFirstCommitCalculator(
          onboardingTemplateIssueFinder,
          onboarderMapper,
          timeToFirstCommitCollector
        );

      const meanTimeToFirstCommit =
        await meanTimeToFirstCommitCalculator.calculate();

      expect(meanTimeToFirstCommit).toEqual(0);
    });
  });
});
