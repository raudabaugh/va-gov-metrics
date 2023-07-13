const GitHubCommit = require("./GitHubCommit");

class CommitRepository {
  constructor(octokit) {
    this.octokit = octokit;
  }

  async findFirstCommit(repo, { gitHubHandle, onboardingStart }) {
    const commits = await this.octokit.paginate(
      this.octokit.rest.repos.listCommits,
      {
        owner: "department-of-veterans-affairs",
        repo,
        author: gitHubHandle,
        since: onboardingStart,
      },
    );

    const firstCommit = commits.pop();
    return firstCommit
      ? new GitHubCommit({ date: new Date(firstCommit.commit.author.date) })
      : null;
  }
}

module.exports = CommitRepository;
