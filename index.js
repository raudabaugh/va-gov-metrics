const { Octokit } = require("octokit");
const GitHubOnboardingTemplateIssueFinder = require("./src/github/GitHubOnboardingTemplateIssueFinder");
const GitHubHandleExtractor = require("./src/github/GitHubHandleExtractor");
const GitHubOnboarderMapper = require("./src/github/GitHubOnboarderMapper");
const GitHubIssueOnboarderRepository = require("./src/github/GitHubIssueOnboarderRepository");
const DaysToFirstCommitCollector = require("./src/commit/DaysToFirstCommitCollector");
const FirstCommitFinder = require("./src/commit/FirstCommitFinder");
const MeanTimeToFirstCommitCalculator = require("./src/MeanTimeToFirstCommitCalculator");

const octokit = new Octokit({
  auth: process.env.GH_ACCESS_TOKEN,
});

const onboarderRepository = () =>
  new GitHubIssueOnboarderRepository(
    new GitHubOnboardingTemplateIssueFinder(octokit),
    new GitHubOnboarderMapper(new GitHubHandleExtractor())
  );

const daysToFirstCommitCollector = () =>
  new DaysToFirstCommitCollector(new FirstCommitFinder(octokit));

async function main() {
  const meanTimeToFirstCommitCalculator = new MeanTimeToFirstCommitCalculator(
    onboarderRepository(),
    daysToFirstCommitCollector()
  );

  const meanTimeToFirstCommit =
    await meanTimeToFirstCommitCalculator.calculate();
  console.log(
    `Mean Time to First Commit: ${meanTimeToFirstCommit.toFixed(2)} days`
  );
}

if (require.main === module) {
  main();
}

module.exports = main;
