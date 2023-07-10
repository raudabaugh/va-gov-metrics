const { Octokit } = require("octokit");
const OnboardingTemplateIssueFinder = require("./mean-time-to-first-commit/OnboardingTemplateIssueFinder");
const GitHubHandleExtractor = require("./mean-time-to-first-commit/GitHubHandleExtractor");
const OnboarderMapper = require("./mean-time-to-first-commit/OnboarderMapper");
const GitHubIssueOnboarderRepository = require("./mean-time-to-first-commit/GitHubIssueOnboarderRepository");
const DaysToFirstCommitCollector = require("./mean-time-to-first-commit/DaysToFirstCommitCollector");
const FirstCommitFinder = require("./mean-time-to-first-commit/FirstCommitFinder");
const MeanTimeToFirstCommitCalculator = require("./mean-time-to-first-commit/MeanTimeToFirstCommitCalculator");

const octokit = new Octokit({
  auth: process.env.GH_ACCESS_TOKEN,
});

const onboarderRepository = () =>
  new GitHubIssueOnboarderRepository(
    new OnboardingTemplateIssueFinder(octokit),
    new OnboarderMapper(new GitHubHandleExtractor())
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
