class TimeToFirstCommitCollector {
  constructor(firstCommitFinder) {
    this.firstCommitFinder = firstCommitFinder;
  }

  async collect(onboarders) {
    const daysToFirstCommit = [];
    for (const { gitHubHandle, onboardingStart } of onboarders) {
      const firstCommitDates = await Promise.all(
        ["vets-website", "vets-api"].map((repositoryName) =>
          this.firstCommitFinder.findFirstCommit(
            repositoryName,
            gitHubHandle,
            onboardingStart
          )
        )
      );

      const firstCommitDate = firstCommitDates
        .filter((d) => !isNaN(d.valueOf()))
        .reduce((acc, n) => (acc < n ? acc : n), new Date(undefined));

      if (isNaN(firstCommitDate)) {
        continue;
      }

      const firstCommitMillis =
        new Date(firstCommitDate) - new Date(onboardingStart);

      daysToFirstCommit.push(firstCommitMillis / 1000 / 60 / 60 / 24);
    }

    return daysToFirstCommit;
  }
}

module.exports = TimeToFirstCommitCollector;
