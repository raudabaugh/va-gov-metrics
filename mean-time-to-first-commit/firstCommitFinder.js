export class FirstCommitFinder {

    constructor(octokit, githubHandle, onboardingStart) {
        this.octokit = octokit;
        this.githubHandle = githubHandle;
        this.onboardingStart = onboardingStart;
    }

    async findFirstCommitTo(repoName) {
        const firstCommit =
            (await this.octokit.paginate(this.octokit.rest.repos.listCommits, {
                owner: 'department-of-veterans-affairs',
                repo: repoName,
                author: this.githubHandle,
                since: this.onboardingStart
            }))
            .map(function(commit) {
                return commit.commit.author.date;
            })
            .pop();

        return firstCommit;
    }

    calculateFirstCommitDateTime(date1, date2) {
        if(date1 && date2)
            return new Date(date1) < new Date(date2) ? date1 : date2;

        if(date1)
            return date1;

        if(date2)
            return date2;
    }
}