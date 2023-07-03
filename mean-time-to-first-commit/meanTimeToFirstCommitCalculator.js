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
        let nonCommitters = 0;
        const onboardingIssues = await this.onboardingTemplateIssueFinder.getAllOnboardingTemplateIssues();

        for (const onboardingIssue of onboardingIssues) {
            const ghHandle = this.githubHandleExtractor.extractGitHubHandle(onboardingIssue);
            const onboardingStart = onboardingIssue.created_at;

            const firstCommitFinder = new FirstCommitFinder(this.octokit, ghHandle, onboardingStart);
            const firstCommitToVetsWebsite = await firstCommitFinder.findFirstCommitTo('vets-website');
            const firstCommitToVetsApi = await firstCommitFinder.findFirstCommitTo('vets-api');
            const firstCommitDateTime = firstCommitFinder.calculateFirstCommitDateTime(firstCommitToVetsWebsite, firstCommitToVetsApi);

            if(!firstCommitDateTime) {
                nonCommitters++;
                continue;
            }

            this.results.push({
                "githubHandle": ghHandle,
                "onboardingStart": onboardingStart,
                "firstCommitDateTime": firstCommitDateTime
            });
        }

        console.log("Total Onboarders: %d", onboardingIssues.length);
        console.log("Total Committers: %d", onboardingIssues.length - nonCommitters);
        console.log("Percent of Onboarders Committing: %d%%", ((onboardingIssues.length - nonCommitters) / onboardingIssues.length).toFixed(2) * 100);

        return this.results.map((result => {
                return (new Date(result.firstCommitDateTime) - new Date(result.onboardingStart)) / 1000 / 60 / 60 / 24
            }))
            .reduce((sum, measurement) => {
                return sum + measurement;
            }, 0) / this.results.length;
    }
}