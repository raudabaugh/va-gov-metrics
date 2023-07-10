const MeanTimeToFirstCommitCalculator = require("../MeanTimeToFirstCommitCalculator");
const GitHubIssueOnboarderRepository = require("../github/GitHubIssueOnboarderRepository");
const DaysToFirstCommitReducer = require("../commit/DaysToFirstCommitReducer");
const { createOnboarder } = require("./factories");

jest.mock("../github/GitHubIssueOnboarderRepository");
jest.mock("../commit/DaysToFirstCommitReducer");

describe("MeanTimeToFirstCommitCalculator", () => {
  describe("calculate", () => {
    it("returns the mean time to first commit", async () => {
      const gitHubIssueOnboarderRepository =
        new GitHubIssueOnboarderRepository();
      gitHubIssueOnboarderRepository.findAll.mockResolvedValue([
        createOnboarder(),
      ]);

      const daysToFirstCommitReducer = new DaysToFirstCommitReducer();
      daysToFirstCommitReducer.reduce.mockResolvedValue([3]);

      const meanTimeToFirstCommitCalculator =
        new MeanTimeToFirstCommitCalculator(
          gitHubIssueOnboarderRepository,
          daysToFirstCommitReducer,
        );

      const meanTimeToFirstCommit =
        await meanTimeToFirstCommitCalculator.calculate();

      expect(meanTimeToFirstCommit).toEqual(3);
    });

    it("returns zero when there's no onboarders", async () => {
      const gitHubIssueOnboarderRepository =
        new GitHubIssueOnboarderRepository();
      gitHubIssueOnboarderRepository.findAll.mockResolvedValue([]);

      const daysToFirstCommitReducer = new DaysToFirstCommitReducer();

      const meanTimeToFirstCommitCalculator =
        new MeanTimeToFirstCommitCalculator(
          gitHubIssueOnboarderRepository,
          daysToFirstCommitReducer,
        );

      const meanTimeToFirstCommit =
        await meanTimeToFirstCommitCalculator.calculate();

      expect(meanTimeToFirstCommit).toEqual(0);
    });

    it("ignores onboarders without a commit", async () => {
      const gitHubIssueOnboarderRepository =
        new GitHubIssueOnboarderRepository();
      gitHubIssueOnboarderRepository.findAll.mockResolvedValue([
        createOnboarder(),
        createOnboarder(),
      ]);

      const daysToFirstCommitReducer = new DaysToFirstCommitReducer();
      daysToFirstCommitReducer.reduce
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(null);

      const meanTimeToFirstCommitCalculator =
        new MeanTimeToFirstCommitCalculator(
          gitHubIssueOnboarderRepository,
          daysToFirstCommitReducer,
        );

      const meanTimeToFirstCommit =
        await meanTimeToFirstCommitCalculator.calculate();

      expect(meanTimeToFirstCommit).toEqual(3);
    });
  });
});
