import { OnboardingTemplateIssueFinder } from "./onboardingTemplateIssueFinder.js";
import { GithubHandleExtractor } from "./githubHandleExtractor.js";
import { FirstCommitFinder } from "./firstCommitFinder.js";

export class MeanTimeToFirstCommitCalculator {

    constructor(octokit) {
        this.octokit = octokit;
        this.onboardingTemplateIssueFinder = new OnboardingTemplateIssueFinder(this.octokit);
        this.githubHandleExtractor = new GithubHandleExtractor();
        this.results = [];
    }

    async calculate() {
        const onboardingIssues = await this.onboardingTemplateIssueFinder.getAllOnboardingTemplateIssues();
        for (const onboardingIssue of onboardingIssues) {
            const ghHandle = this.githubHandleExtractor.extractGitHubHandle(onboardingIssue);
            const onboardingStart = onboardingIssue.created_at;

            const firstCommitFinder = new FirstCommitFinder(this.octokit, ghHandle, onboardingStart);
            const firstCommitToVetsWebsite = await firstCommitFinder.findFirstCommitTo('vets-website');
            const firstCommitToVetsApi = await firstCommitFinder.findFirstCommitTo('vets-api');
            const firstCommitDateTime = firstCommitFinder.calculateFirstCommitDateTime(firstCommitToVetsWebsite, firstCommitToVetsApi);

            if(!firstCommitDateTime) {
                continue;
            }

            this.results.push({
                "githubHandle": ghHandle,
                "onboardingStart": onboardingStart,
                "firstCommitDateTime": firstCommitDateTime
            });
        }

        return this.results.map((result => {
                return (new Date(result.firstCommitDateTime) - new Date(result.onboardingStart)) / 1000 / 60 / 60 / 24
            }))
            .reduce((sum, measurement) => {
                return sum + measurement;
            }, 0) / this.results.length;
    }
}