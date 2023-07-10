const MeanTimeToFirstCommitCalculator = require("../MeanTimeToFirstCommitCalculator");
const GitHubIssueOnboarderRepository = require("../github/GitHubIssueOnboarderRepository");
const DaysToFirstCommitCollector = require("../commit/DaysToFirstCommitCollector");
const { createOnboarder } = require("./factories");

jest.mock("../github/GitHubIssueOnboarderRepository");
jest.mock("../commit/DaysToFirstCommitCollector");

describe("MeanTimeToFirstCommitCalculator", () => {
  describe("calculate", () => {
    it("returns the mean time to first commit", async () => {
      const gitHubIssueOnboarderRepository =
        new GitHubIssueOnboarderRepository();
      gitHubIssueOnboarderRepository.findAll.mockResolvedValue([
        createOnboarder(),
      ]);

      const daysToFirstCommitCollector = new DaysToFirstCommitCollector();
      daysToFirstCommitCollector.collect.mockResolvedValue([3]);

      const meanTimeToFirstCommitCalculator =
        new MeanTimeToFirstCommitCalculator(
          gitHubIssueOnboarderRepository,
          daysToFirstCommitCollector
        );

      const meanTimeToFirstCommit =
        await meanTimeToFirstCommitCalculator.calculate();

      expect(meanTimeToFirstCommit).toEqual(3);
    });

    it("returns zero when there's no onboarders", async () => {
      const gitHubIssueOnboarderRepository =
        new GitHubIssueOnboarderRepository();
      gitHubIssueOnboarderRepository.findAll.mockResolvedValue([]);

      const daysToFirstCommitCollector = new DaysToFirstCommitCollector();
      daysToFirstCommitCollector.collect.mockResolvedValue([]);

      const meanTimeToFirstCommitCalculator =
        new MeanTimeToFirstCommitCalculator(
          gitHubIssueOnboarderRepository,
          daysToFirstCommitCollector
        );

      const meanTimeToFirstCommit =
        await meanTimeToFirstCommitCalculator.calculate();

      expect(meanTimeToFirstCommit).toEqual(0);
    });
  });
});
