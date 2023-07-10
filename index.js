const { Octokit } = require("octokit");
const GitHubOnboardingTemplateIssueFinder = require("./src/github/GitHubOnboardingTemplateIssueFinder");
const GitHubHandleExtractor = require("./src/github/GitHubHandleExtractor");
const GitHubOnboarderMapper = require("./src/github/GitHubOnboarderMapper");
const GitHubIssueOnboarderRepository = require("./src/github/GitHubIssueOnboarderRepository");
const DaysToFirstCommitReducer = require("./src/commit/DaysToFirstCommitReducer");
const FirstCommitDateFinder = require("./src/commit/FirstCommitDateFinder");
const MeanTimeToFirstCommitCalculator = require("./src/MeanTimeToFirstCommitCalculator");

const octokit = new Octokit({
  auth: process.env.PERSONAL_ACCESS_TOKEN,
});

const onboarderRepository = () =>
  new GitHubIssueOnboarderRepository(
    new GitHubOnboardingTemplateIssueFinder(octokit),
    new GitHubOnboarderMapper(new GitHubHandleExtractor()),
  );

const daysToFirstCommitReducer = () =>
  new DaysToFirstCommitReducer(new FirstCommitDateFinder(octokit));

async function main() {
  const meanTimeToFirstCommitCalculator = new MeanTimeToFirstCommitCalculator(
    onboarderRepository(),
    daysToFirstCommitReducer(),
  );

  const meanTimeToFirstCommit =
    await meanTimeToFirstCommitCalculator.calculate();
  console.log(
    `Mean Time to First Commit: ${meanTimeToFirstCommit.toFixed(2)} days`,
  );
}

if (require.main === module) {
  main();
}

module.exports = main;
