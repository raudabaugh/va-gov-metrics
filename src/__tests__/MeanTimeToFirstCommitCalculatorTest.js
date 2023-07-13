const MeanTimeToFirstCommitCalculator = require("../MeanTimeToFirstCommitCalculator");
const GitHubIssueOnboarderRepository = require("../github/GitHubIssueOnboarderRepository");
const CommitRepository = require("../commit/CommitRepository");
const { createOnboarder } = require("./factories");
const { createGitHubCommit } = require("../commit/__tests__/factories");

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
      const vetsWebsiteFirstCommit = createGitHubCommit();
      const vetsApiFirstCommit = createGitHubCommit();
      commitRepository.findFirstBy
        .mockResolvedValueOnce(vetsWebsiteFirstCommit)
        .mockResolvedValueOnce(vetsApiFirstCommit);

      const meanTimeToFirstCommitCalculator =
        new MeanTimeToFirstCommitCalculator(
          gitHubIssueOnboarderRepository,
          commitRepository,
        );

      const meanTimeToFirstCommit =
        await meanTimeToFirstCommitCalculator.calculate();

      expect(onboarder.daysToFirstCommit).toHaveBeenCalledWith([
        vetsWebsiteFirstCommit,
        vetsApiFirstCommit,
      ]);
      expect(meanTimeToFirstCommit).toEqual(3);
    });

    it("ignores repos that the onboarder has no committed to", async () => {
      const gitHubIssueOnboarderRepository =
        new GitHubIssueOnboarderRepository();
      const onboarder = createOnboarder();
      jest.spyOn(onboarder, "daysToFirstCommit").mockReturnValue(null);
      gitHubIssueOnboarderRepository.findAll.mockResolvedValue([onboarder]);

      const commitRepository = new CommitRepository();
      commitRepository.findFirstBy.mockResolvedValue(null);

      const meanTimeToFirstCommitCalculator =
        new MeanTimeToFirstCommitCalculator(
          gitHubIssueOnboarderRepository,
          commitRepository,
        );

      const meanTimeToFirstCommit =
        await meanTimeToFirstCommitCalculator.calculate();

      expect(onboarder.daysToFirstCommit).toHaveBeenCalledWith([]);
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
