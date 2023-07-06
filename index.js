import { Octokit } from "octokit";
import { OnboardingTemplateIssueFinder } from "./mean-time-to-first-commit/onboardingTemplateIssueFinder.js";
import { GitHubHandleExtractor } from "./mean-time-to-first-commit/gitHubHandleExtractor.js";
import { OnboarderMapper } from "./mean-time-to-first-commit/onboarderMapper.js";
import { TimeToFirstCommitCollector } from "./mean-time-to-first-commit/timeToFirstCommitCollector.js";
import { FirstCommitFinder } from "./mean-time-to-first-commit/firstCommitFinder.js";
import { MeanTimeToFirstCommitCalculator } from "./mean-time-to-first-commit/meanTimeToFirstCommitCalculator.js";

const octokit = new Octokit({
    auth: process.env.GH_ACCESS_TOKEN
});

const onboardingTemplateIssueFinder = new OnboardingTemplateIssueFinder(octokit);
const gitHubHandleExtractor = new GitHubHandleExtractor();
const onboarderMapper = new OnboarderMapper(gitHubHandleExtractor);
const firstCommitFinder = new FirstCommitFinder(octokit);
const timeToFirstCommitCollector = new TimeToFirstCommitCollector(firstCommitFinder);

const meanTimeToFirstCommitCalculator = new MeanTimeToFirstCommitCalculator(onboardingTemplateIssueFinder, onboarderMapper, timeToFirstCommitCollector);
const meanTimeToFirstCommit = await meanTimeToFirstCommitCalculator.calculate();
console.log("Mean Time to First Commit: %d days", meanTimeToFirstCommit);