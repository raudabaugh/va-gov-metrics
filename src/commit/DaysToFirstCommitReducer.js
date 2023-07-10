class DaysToFirstCommitReducer {
  constructor(firstCommitDateFinder) {
    this.firstCommitDateFinder = firstCommitDateFinder;
  }

  async reduce(onboarder) {
    const possibleFirstCommitDates = await Promise.all(
      ["vets-website", "vets-api"].map((repo) =>
        this.firstCommitDateFinder.find(repo, onboarder),
      ),
    );

    const firstCommitDates = possibleFirstCommitDates.filter((d) => d);
    if (!firstCommitDates.length) {
      return null;
    }

    const firstCommitDate = firstCommitDates.reduce((acc, n) =>
      acc < n ? acc : n,
    );
    const firstCommitMillis = firstCommitDate - onboarder.onboardingStart;

    return this.#millisToDays(firstCommitMillis);
  }

  #millisToDays(firstCommitMillis) {
    return firstCommitMillis / 1000 / 60 / 60 / 24;
  }
}

module.exports = DaysToFirstCommitReducer;
