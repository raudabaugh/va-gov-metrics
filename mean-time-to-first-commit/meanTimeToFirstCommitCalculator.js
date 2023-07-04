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
        const onboardingTemplateIssues = await this.onboardingTemplateIssueFinder.findAll();

        for (const onboardingTemplateIssue of onboardingTemplateIssues) {
            const ghHandle = this.githubHandleExtractor.extractFrom(onboardingTemplateIssue);
            const onboardingStart = onboardingTemplateIssue.created_at;

            const firstCommitFinder = new FirstCommitFinder(this.octokit, ghHandle, onboardingStart);
            const firstCommitToVetsWebsite = await firstCommitFinder.findFirstCommitTo('vets-website');
            const firstCommitToVetsApi = await firstCommitFinder.findFirstCommitTo('vets-api');
            const firstCommitDateTime = this.#calculateFirstCommitDateTime(firstCommitToVetsWebsite, firstCommitToVetsApi);

            if(isNaN(firstCommitDateTime)) {
                nonCommitters++;
                continue;
            }

            this.results.push({
                "githubHandle": ghHandle,
                "onboardingStart": onboardingStart,
                "firstCommitDateTime": firstCommitDateTime
            });
        }

        console.log("Total Onboarders: %d", onboardingTemplateIssues.length);
        console.log("Total Committers: %d", onboardingTemplateIssues.length - nonCommitters);
        console.log("Percent of Onboarders Committing: %d%%", ((onboardingTemplateIssues.length - nonCommitters) / onboardingTemplateIssues.length).toFixed(2) * 100);

        const meanTimeToFirstCommit =
            this.results.map((result => {
                const timeToFirstCommit = new Date(result.firstCommitDateTime) - new Date(result.onboardingStart);
                return timeToFirstCommit / 1000 / 60 / 60 / 24;
            }))
            .reduce((sum, measurement) => {
                return sum + measurement;
            }, 0) / this.results.length;

        return meanTimeToFirstCommit.toFixed(2);
    }

    #calculateFirstCommitDateTime(...dates) {
        dates = dates.filter(date => {
            return !isNaN(date.valueOf());
        });

        return new Date(Math.min(...dates));
    }
}