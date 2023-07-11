const { Octokit } = require("octokit");
const GitHubOnboardingTemplateIssueFinder = require("./src/github/GitHubOnboardingTemplateIssueFinder");
const GitHubHandleExtractor = require("./src/github/GitHubHandleExtractor");
const GitHubOnboarderMapper = require("./src/github/GitHubOnboarderMapper");
const GitHubIssueOnboarderRepository = require("./src/github/GitHubIssueOnboarderRepository");
const RosterOnboarderRepository = require("./src/roster/RosterOnboarderRepository");
const DaysToFirstCommitReducer = require("./src/commit/DaysToFirstCommitReducer");
const FirstCommitDateFinder = require("./src/commit/FirstCommitDateFinder");
const MeanTimeToFirstCommitCalculator = require("./src/MeanTimeToFirstCommitCalculator");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const gitHubIssueOnboarderRepository = () =>
  new GitHubIssueOnboarderRepository(
    new GitHubOnboardingTemplateIssueFinder(octokit),
    new GitHubOnboarderMapper(new GitHubHandleExtractor()),
  );

const daysToFirstCommitReducer = () =>
  new DaysToFirstCommitReducer(new FirstCommitDateFinder(octokit));

const rosterOnboarderRepository = () => new RosterOnboarderRepository();

const main = async () => {
  await Promise.all([
    calculateMeanTimeToFirstCommit(
      "Mean Time to First Commit based on GitHub Onboarding Issues",
      gitHubIssueOnboarderRepository(),
    ),
    calculateMeanTimeToFirstCommit(
      "Mean Time to First Commit based on Roster",
      rosterOnboarderRepository(),
    ),
  ]);
};

const calculateMeanTimeToFirstCommit = async (label, onboarderRepository) => {
  const meanTimeToFirstCommitCalculator = new MeanTimeToFirstCommitCalculator(
    onboarderRepository,
    daysToFirstCommitReducer(),
  );

  const meanTimeToFirstCommit =
    await meanTimeToFirstCommitCalculator.calculate();
  console.log(`${label}: ${meanTimeToFirstCommit.toFixed(2)} days`);
};

if (require.main === module) {
  main();
}

module.exports = main;
