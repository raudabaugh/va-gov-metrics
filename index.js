const { Octokit } = require("@octokit/rest");
const { throttling } = require("@octokit/plugin-throttling");
const GitHubIssueOnboarderRepository = require("./src/github/GitHubIssueOnboarderRepository");
const RosterMemberRepository = require("./src/roster/RosterMemberRepository");
const CommitRepository = require("./src/commit/CommitRepository");
const MeanTimeToFirstCommitCalculator = require("./src/MeanTimeToFirstCommitCalculator");
const defaultRoster = require("./src/roster/roster.json");

const throttledOctokit = () => {
  const ThrottledOctokit = Octokit.plugin(throttling);

  return new ThrottledOctokit({
    auth: process.env.GITHUB_TOKEN,
    throttle: {
      onRateLimit: (retryAfter, { method, url }, octokit) => {
        octokit.log.warn(
          `Request quota exhausted for request ${method} ${url}, retrying after ${retryAfter}`,
        );
        return true;
      },
      onSecondaryRateLimit: (retryAfter, { method, url }, octokit) => {
        octokit.log.warn(
          `SecondaryRateLimit detected for request ${method} ${url}, retrying after ${retryAfter}`,
        );
        return true;
      },
    },
  });
};

const main = async (roster = defaultRoster) => {
  const octokit = throttledOctokit();
  const gitHubIssueOnboarderRepository = new GitHubIssueOnboarderRepository(
    octokit,
  );
  const rosterMemberRepository = new RosterMemberRepository(roster);
  const commitRepository = new CommitRepository(octokit);

  await Promise.all([
    calculateMeanTimeToFirstCommit(
      "Mean Time to First Commit based on GitHub Onboarding Issues (days)",
      gitHubIssueOnboarderRepository,
      commitRepository,
    ),
    calculateMeanTimeToFirstCommit(
      "Mean Time to First Commit based on Roster (days)",
      rosterMemberRepository,
      commitRepository,
    ),
  ]);
};

const calculateMeanTimeToFirstCommit = async (
  label,
  onboarderRepository,
  commitRepository,
) => {
  const meanTimeToFirstCommitCalculator = new MeanTimeToFirstCommitCalculator(
    onboarderRepository,
    commitRepository,
  );

  const meanTimeToFirstCommit =
    await meanTimeToFirstCommitCalculator.calculate();
  console.log(`${label}: ${meanTimeToFirstCommit.toFixed(2)}`);
};

if (require.main === module) {
  main();
}

module.exports = main;
