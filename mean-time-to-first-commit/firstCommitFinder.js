export class FirstCommitFinder {

    constructor(octokit) {
        this.octokit = octokit;
    }

    async findFirstCommit(repoName, githubHandle, onboardingStart) {
        const firstCommit =
            (await this.octokit.paginate(this.octokit.rest.repos.listCommits, {
                owner: 'department-of-veterans-affairs',
                repo: repoName,
                author: githubHandle,
                since: onboardingStart
            }))
            .map(function(commit) {
                return commit.commit.author.date;
            })
            .pop();

        return new Date(firstCommit);
    }
}