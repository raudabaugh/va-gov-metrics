class Onboarder {
  constructor({ gitHubHandle, onboardingStart }) {
    this.gitHubHandle = gitHubHandle;
    this.onboardingStart = onboardingStart;
  }

  daysToFirstCommit(possibleCommitDates) {
    const commitDates = possibleCommitDates.filter((d) => d);
    if (!commitDates.length) {
      return null;
    }

    const firstCommitDate = commitDates.reduce((acc, n) => (acc < n ? acc : n));
    const firstCommitDiffInMillis = firstCommitDate - this.onboardingStart;
    const firstCommitDiffInDays = firstCommitDiffInMillis / 1000 / 60 / 60 / 24;
    return firstCommitDiffInDays;
  }
}

module.exports = Onboarder;
