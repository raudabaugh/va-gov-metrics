class DaysToFirstCommitCollector {
  constructor(firstCommitFinder) {
    this.firstCommitFinder = firstCommitFinder;
  }

  async collect(onboarders) {
    const daysToFirstCommit = [];
    for (const onboarder of onboarders) {
      const possibleFirstCommitDates = await Promise.all(
        ["vets-website", "vets-api"].map((repositoryName) =>
          this.firstCommitFinder.find(repositoryName, onboarder)
        )
      );

      const firstCommitDates = possibleFirstCommitDates.filter((d) => d);
      if (!firstCommitDates.length) {
        continue;
      }

      const firstCommitDate = firstCommitDates.reduce((acc, n) =>
        acc < n ? acc : n
      );
      const firstCommitMillis = firstCommitDate - onboarder.onboardingStart;

      daysToFirstCommit.push(this.#millisToDays(firstCommitMillis));
    }

    return daysToFirstCommit;
  }

  #millisToDays(firstCommitMillis) {
    return firstCommitMillis / 1000 / 60 / 60 / 24;
  }
}

module.exports = DaysToFirstCommitCollector;
