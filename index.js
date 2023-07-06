const { Octokit } = require("octokit");
const OnboardingTemplateIssueFinder = require("./mean-time-to-first-commit/onboardingTemplateIssueFinder");
const GitHubHandleExtractor = require("./mean-time-to-first-commit/gitHubHandleExtractor");
const OnboarderMapper = require("./mean-time-to-first-commit/onboarderMapper");
const TimeToFirstCommitCollector = require("./mean-time-to-first-commit/timeToFirstCommitCollector");
const FirstCommitFinder = require("./mean-time-to-first-commit/firstCommitFinder");
const MeanTimeToFirstCommitCalculator = require("./mean-time-to-first-commit/meanTimeToFirstCommitCalculator");

const octokit = new Octokit({
    auth: process.env.GH_ACCESS_TOKEN
});

const onboardingTemplateIssueFinder = new OnboardingTemplateIssueFinder(octokit);
const gitHubHandleExtractor = new GitHubHandleExtractor();
const onboarderMapper = new OnboarderMapper(gitHubHandleExtractor);
const firstCommitFinder = new FirstCommitFinder(octokit);
const timeToFirstCommitCollector = new TimeToFirstCommitCollector(firstCommitFinder);

const meanTimeToFirstCommitCalculator = new MeanTimeToFirstCommitCalculator(onboardingTemplateIssueFinder, onboarderMapper, timeToFirstCommitCollector);

async function main() {
    const meanTimeToFirstCommit = await meanTimeToFirstCommitCalculator.calculate();
    console.log(`Mean Time to First Commit: ${meanTimeToFirstCommit} days`);
}

if(require.main === module) {
    main();
}

module.exports = main;