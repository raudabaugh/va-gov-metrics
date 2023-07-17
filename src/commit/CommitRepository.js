import Commit from "./Commit.js";

export default class CommitRepository {
  constructor(octokit) {
    this.octokit = octokit;
  }

  async findFirstBy(repo, { gitHubHandle, onboardingStart }) {
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
      ? new Commit({ date: new Date(firstCommit.commit.author.date) })
      : null;
  }
}
