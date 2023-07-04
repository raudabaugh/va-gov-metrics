import { OnboardingTemplateIssueFinder } from "./onboardingTemplateIssueFinder.js";
import { GitHubHandleExtractor } from "./gitHubHandleExtractor.js";
import { FirstCommitFinder } from "./firstCommitFinder.js";

export class MeanTimeToFirstCommitCalculator {

    constructor(octokit) {
        this.octokit = octokit;
        this.onboardingTemplateIssueFinder = new OnboardingTemplateIssueFinder(this.octokit);
        this.gitHubHandleExtractor = new GitHubHandleExtractor();
    }

    async calculate() {
        const onboardingTemplateIssues = await this.onboardingTemplateIssueFinder.findAll();
        const timesToFirstCommit = await this.#collectTimesToFirstCommit(onboardingTemplateIssues);

        const meanTimeToFirstCommit =
            timesToFirstCommit
            .reduce((sum, measurement) => {
                return sum + measurement;
            }, 0) / timesToFirstCommit.length;

        return meanTimeToFirstCommit.toFixed(2);
    }

    async #collectTimesToFirstCommit(onboardingTemplateIssues) {
        let nonCommitters = 0;
        const timesToFirstCommit = [];
        for (const onboardingTemplateIssue of onboardingTemplateIssues) {
            const ghHandle = this.gitHubHandleExtractor.extractFrom(onboardingTemplateIssue);
            const onboardingStart = onboardingTemplateIssue.created_at;

            const firstCommitFinder = new FirstCommitFinder(this.octokit, ghHandle, onboardingStart);
            const firstCommitToVetsWebsite = await firstCommitFinder.findFirstCommitTo('vets-website');
            const firstCommitToVetsApi = await firstCommitFinder.findFirstCommitTo('vets-api');
            const firstCommit = this.#calculateFirstCommitDateTime(firstCommitToVetsWebsite, firstCommitToVetsApi);

            if(isNaN(firstCommit)) {
                nonCommitters++;
                continue;
            }

            const timeToFirstCommit = new Date(firstCommit) - new Date(onboardingStart);

            timesToFirstCommit.push(timeToFirstCommit / 1000 / 60 / 60 / 24);
        }

        console.log("Total Onboarders: %d", onboardingTemplateIssues.length);
        console.log("Total Committers: %d", onboardingTemplateIssues.length - nonCommitters);
        console.log("Percent of Onboarders Committing: %d%%", ((onboardingTemplateIssues.length - nonCommitters) / onboardingTemplateIssues.length).toFixed(2) * 100);

        return timesToFirstCommit;
    }

    #calculateFirstCommitDateTime(...dates) {
        dates = dates.filter(date => {
            return !isNaN(date.valueOf());
        });

        return new Date(Math.min(...dates));
    }
}