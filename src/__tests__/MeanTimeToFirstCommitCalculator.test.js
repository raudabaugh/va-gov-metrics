const { describe, it, mock } = require("node:test");
const assert = require("node:assert").strict;
const MeanTimeToFirstCommitCalculator = require("../MeanTimeToFirstCommitCalculator");
const GitHubIssueOnboarderRepository = require("../github/GitHubIssueOnboarderRepository");
const CommitRepository = require("../commit/CommitRepository");
const { createOnboarder } = require("./factories");
const { createCommit } = require("../commit/__tests__/factories");

describe("MeanTimeToFirstCommitCalculator", () => {
  describe("calculate", () => {
    it("returns the mean time to first commit", async () => {
      const onboarderRepository = new GitHubIssueOnboarderRepository();
      const onboarder = createOnboarder();
      mock.method(onboarder, "daysToFirstCommit", () => 3);
      mock.method(onboarderRepository, "findAll", () => [onboarder]);

      const commitRepository = new CommitRepository();
      const vetsWebsiteFirstCommit = createCommit();
      const vetsApiFirstCommit = createCommit();
      mock.method(
        commitRepository,
        "findFirstBy",
        () => vetsWebsiteFirstCommit,
        { times: 1 },
      );
      mock.method(commitRepository, "findFirstBy", () => vetsApiFirstCommit, {
        times: 1,
      });

      const meanTimeToFirstCommitCalculator =
        new MeanTimeToFirstCommitCalculator(
          onboarderRepository,
          commitRepository,
        );

      const meanTimeToFirstCommit =
        await meanTimeToFirstCommitCalculator.calculate();

      assert.equal(onboarder.daysToFirstCommit.mock.calls.length, 1);
      assert.deepEqual(onboarder.daysToFirstCommit.mock.calls[0].arguments[0], [
        vetsWebsiteFirstCommit,
        vetsApiFirstCommit,
      ]);
      assert.equal(meanTimeToFirstCommit, 3);
    });

    it("ignores repos that the onboarder has no committed to", async () => {
      const onboarderRepository = new GitHubIssueOnboarderRepository();
      const onboarder = createOnboarder();
      mock.method(onboarder, "daysToFirstCommit", () => null);
      mock.method(onboarderRepository, "findAll", () => [onboarder]);

      const commitRepository = new CommitRepository();
      mock.method(commitRepository, "findFirstBy", () => null);

      const meanTimeToFirstCommitCalculator =
        new MeanTimeToFirstCommitCalculator(
          onboarderRepository,
          commitRepository,
        );

      const meanTimeToFirstCommit =
        await meanTimeToFirstCommitCalculator.calculate();

      assert.equal(onboarder.daysToFirstCommit.mock.calls.length, 1);
      assert.deepEqual(
        onboarder.daysToFirstCommit.mock.calls[0].arguments[0],
        [],
      );
      assert.equal(meanTimeToFirstCommit, 0);
    });

    it("ignores onboarders without a commit", async () => {
      const onboarderRepository = new GitHubIssueOnboarderRepository();
      const onboarder1 = createOnboarder();
      mock.method(onboarder1, "daysToFirstCommit", () => 3);
      const onboarder2 = createOnboarder();
      mock.method(onboarder2, "daysToFirstCommit", () => null);
      mock.method(onboarderRepository, "findAll", () => [
        onboarder1,
        onboarder2,
      ]);

      const commitRepository = new CommitRepository();
      mock.method(commitRepository, "findFirstBy", () => [createCommit()]);

      const meanTimeToFirstCommitCalculator =
        new MeanTimeToFirstCommitCalculator(
          onboarderRepository,
          commitRepository,
        );

      const meanTimeToFirstCommit =
        await meanTimeToFirstCommitCalculator.calculate();

      assert.equal(meanTimeToFirstCommit, 3);
    });
  });
});
