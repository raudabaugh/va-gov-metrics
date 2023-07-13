const MeanTimeToFirstCommitCalculator = require("../MeanTimeToFirstCommitCalculator");
const GitHubIssueOnboarderRepository = require("../github/GitHubIssueOnboarderRepository");
const CommitRepository = require("../commit/CommitRepository");
const { createOnboarder } = require("./factories");

jest.mock("../github/GitHubIssueOnboarderRepository");
jest.mock("../commit/CommitRepository");

describe("MeanTimeToFirstCommitCalculator", () => {
  describe("calculate", () => {
    it("returns the mean time to first commit", async () => {
      const gitHubIssueOnboarderRepository =
        new GitHubIssueOnboarderRepository();
      const onboarder = createOnboarder();
      jest.spyOn(onboarder, "daysToFirstCommit").mockReturnValue(3);
      gitHubIssueOnboarderRepository.findAll.mockResolvedValue([onboarder]);

      const commitRepository = new CommitRepository();
      const commitDate1 = new Date("2023-07-01T00:00:00Z");
      const commitDate2 = new Date("2023-07-02T00:00:00Z");
      commitRepository.findFirstCommit
        .mockResolvedValueOnce(commitDate1)
        .mockResolvedValueOnce(commitDate2);

      const meanTimeToFirstCommitCalculator =
        new MeanTimeToFirstCommitCalculator(
          gitHubIssueOnboarderRepository,
          commitRepository,
        );

      const meanTimeToFirstCommit =
        await meanTimeToFirstCommitCalculator.calculate();

      expect(onboarder.daysToFirstCommit).toHaveBeenCalledWith([
        commitDate1,
        commitDate2,
      ]);
      expect(meanTimeToFirstCommit).toEqual(3);
    });

    it("returns zero when there's no onboarders", async () => {
      const gitHubIssueOnboarderRepository =
        new GitHubIssueOnboarderRepository();
      gitHubIssueOnboarderRepository.findAll.mockResolvedValue([]);

      const commitRepository = new CommitRepository();

      const meanTimeToFirstCommitCalculator =
        new MeanTimeToFirstCommitCalculator(
          gitHubIssueOnboarderRepository,
          commitRepository,
        );

      const meanTimeToFirstCommit =
        await meanTimeToFirstCommitCalculator.calculate();

      expect(meanTimeToFirstCommit).toEqual(0);
    });

    it("ignores onboarders without a commit", async () => {
      const gitHubIssueOnboarderRepository =
        new GitHubIssueOnboarderRepository();
      const onboarder1 = createOnboarder();
      jest.spyOn(onboarder1, "daysToFirstCommit").mockReturnValue(3);
      const onboarder2 = createOnboarder();
      jest.spyOn(onboarder2, "daysToFirstCommit").mockReturnValue(null);
      gitHubIssueOnboarderRepository.findAll.mockResolvedValue([
        onboarder1,
        onboarder2,
      ]);

      const commitRepository = new CommitRepository();

      const meanTimeToFirstCommitCalculator =
        new MeanTimeToFirstCommitCalculator(
          gitHubIssueOnboarderRepository,
          commitRepository,
        );

      const meanTimeToFirstCommit =
        await meanTimeToFirstCommitCalculator.calculate();

      expect(meanTimeToFirstCommit).toEqual(3);
    });
  });
});
