class Onboarder {
  constructor({ gitHubHandle, onboardingStart }) {
    this.gitHubHandle = gitHubHandle;
    this.onboardingStart = onboardingStart;
  }

  daysToFirstCommit(possibleCommits) {
    const commits = possibleCommits.filter((commit) => commit);
    if (!commits.length) {
      return null;
    }

    const firstCommitDate = commits
      .map(({ date }) => date)
      .reduce((acc, date) => (acc < date ? acc : date));
    const firstCommitDiffInMillis = firstCommitDate - this.onboardingStart;
    const firstCommitDiffInDays = firstCommitDiffInMillis / 1000 / 60 / 60 / 24;
    return firstCommitDiffInDays;
  }
}

module.exports = Onboarder;
