const { Octokit } = require("@octokit/rest");
const { throttling } = require("@octokit/plugin-throttling");
const GitHubOnboardingTemplateIssueFinder = require("./src/github/GitHubOnboardingTemplateIssueFinder");
const GitHubHandleExtractor = require("./src/github/GitHubHandleExtractor");
const GitHubOnboarderMapper = require("./src/github/GitHubOnboarderMapper");
const GitHubIssueOnboarderRepository = require("./src/github/GitHubIssueOnboarderRepository");
const RosterOnboarderRepository = require("./src/roster/RosterOnboarderRepository");
const DaysToFirstCommitReducer = require("./src/commit/DaysToFirstCommitReducer");
const FirstCommitDateFinder = require("./src/commit/FirstCommitDateFinder");
const MeanTimeToFirstCommitCalculator = require("./src/MeanTimeToFirstCommitCalculator");

const throttledOctokit = () => {
  const ThrottledOctokit = Octokit.plugin(throttling);

  return new ThrottledOctokit({
    auth: process.env.GITHUB_TOKEN,
    throttle: {
      onRateLimit: () => true,
      onSecondaryRateLimit: () => true,
    },
  });
};

const gitHubIssueOnboarderRepository = (octokit) =>
  new GitHubIssueOnboarderRepository(
    new GitHubOnboardingTemplateIssueFinder(octokit),
    new GitHubOnboarderMapper(new GitHubHandleExtractor()),
  );

const daysToFirstCommitReducer = (octokit) =>
  new DaysToFirstCommitReducer(new FirstCommitDateFinder(octokit));

const rosterOnboarderRepository = () => new RosterOnboarderRepository();

const main = async () => {
  const octokit = throttledOctokit();
  const reducer = daysToFirstCommitReducer(octokit);
  await Promise.all([
    calculateMeanTimeToFirstCommit(
      "Mean Time to First Commit based on GitHub Onboarding Issues",
      gitHubIssueOnboarderRepository(octokit),
      reducer,
    ),
    calculateMeanTimeToFirstCommit(
      "Mean Time to First Commit based on Roster",
      rosterOnboarderRepository(),
      reducer,
    ),
  ]);
};

const calculateMeanTimeToFirstCommit = async (
  label,
  onboarderRepository,
  daysToFirstCommitReducer,
) => {
  const meanTimeToFirstCommitCalculator = new MeanTimeToFirstCommitCalculator(
    onboarderRepository,
    daysToFirstCommitReducer,
  );

  const meanTimeToFirstCommit =
    await meanTimeToFirstCommitCalculator.calculate();
  console.log(`${label}: ${meanTimeToFirstCommit.toFixed(2)} days`);
};

if (require.main === module) {
  main();
}

module.exports = main;
