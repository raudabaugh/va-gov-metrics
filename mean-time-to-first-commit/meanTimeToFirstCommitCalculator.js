import { Octokit } from "octokit";
import { OnboardingTemplateIssueFinder } from "./onboardingTemplateIssueFinder.js";
import { GithubHandleExtractor } from "./githubHandleExtractor.js";
import { FirstCommitFinder } from "./firstCommitFinder.js";

export class MeanTimeToFirstCommitCalculator {

    constructor() {
        this.octokit = new Octokit({
            auth: process.env.GH_ACCESS_TOKEN
        });
        this.onboardingTemplateIssueFinder = new OnboardingTemplateIssueFinder(this.octokit);
        this.githubHandleExtractor = new GithubHandleExtractor();
        this.results = [];
    }

    async calculate() {
        const onboardingIssues = await this.onboardingTemplateIssueFinder.getAllOnboardingTemplateIssues();
        for (const onboardingIssue of onboardingIssues) {
            const ghHandle = this.githubHandleExtractor.extractGitHubHandle(onboardingIssue);

            const firstCommitFinder = new FirstCommitFinder(this.octokit, ghHandle);
            const firstCommitToVetsWebsite = await firstCommitFinder.findFirstCommitTo('vets-website');
            const firstCommitToVetsApi = await firstCommitFinder.findFirstCommitTo('vets-api');
            const firstCommitDateTime = firstCommitFinder.calculateFirstCommitDateTime(firstCommitToVetsWebsite, firstCommitToVetsApi);

            if(!firstCommitDateTime) {
                console.log("%s did not make a commit yet", ghHandle);
                continue;
            }

            this.results.push({
                "githubHandle": ghHandle,
                "onboardingStart": onboardingIssue.created_at,
                "firstCommitDateTime": firstCommitDateTime
            });
        }

        // console.log("\nGitHub User, Onboarding Start, First Commit, Time to First Commit");
        // for (const result of results) {
        //     console.log("%s, %s, %s, %s", result.githubHandle, result.onboardingStart, result.firstCommitDateTime, (new Date(result.firstCommitDateTime) - new Date(result.onboardingStart)) / 1000 / 60 / 60 / 24);
        // }

        return this.results.map((result => {
                return (new Date(result.firstCommitDateTime) - new Date(result.onboardingStart)) / 1000 / 60 / 60 / 24
            }))
            .reduce((sum, measurement) => {
                return sum + measurement;
            }, 0) / this.results.length;

    }
}