class FirstCommitDateFinder {
  constructor(octokit) {
    this.octokit = octokit;
  }

  async find(repo, { gitHubHandle, onboardingStart }) {
    const commits = await this.octokit.paginate(
      this.octokit.rest.repos.listCommits,
      {
        owner: "department-of-veterans-affairs",
        repo,
        author: gitHubHandle,
        since: onboardingStart,
      }
    );

    const firstCommit = commits.pop();
    return firstCommit ? new Date(firstCommit.commit.author.date) : null;
  }
}

module.exports = FirstCommitDateFinder;
