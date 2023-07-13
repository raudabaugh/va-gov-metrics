class MeanTimeToFirstCommitCalculator {
  constructor(onboarderRepository, firstCommitDateFinder) {
    this.onboarderRepository = onboarderRepository;
    this.firstCommitDateFinder = firstCommitDateFinder;
  }

  async calculate() {
    const onboarders = await this.onboarderRepository.findAll();
    const possibleDaysToFirstCommit = await Promise.all(
      onboarders.map(async (onboarder) => {
        const possibleFirstCommitDates = await Promise.all(
          ["vets-website", "vets-api"].map((repo) =>
            this.firstCommitDateFinder.find(repo, onboarder),
          ),
        );

        return onboarder.daysToFirstCommit(possibleFirstCommitDates);
      }),
    );

    if (!possibleDaysToFirstCommit.length) {
      return 0;
    }

    const daysToFirstCommit = possibleDaysToFirstCommit.filter((d) => d);
    if (!daysToFirstCommit.length) {
      return 0;
    }

    const meanTimeToFirstCommit =
      daysToFirstCommit.reduce((acc, n) => acc + n) / daysToFirstCommit.length;

    return meanTimeToFirstCommit;
  }
}

module.exports = MeanTimeToFirstCommitCalculator;
