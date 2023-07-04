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

        return new Date(firstCommit);
    }
}