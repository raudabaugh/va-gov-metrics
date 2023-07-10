class MeanTimeToFirstCommitCalculator {
  constructor(onboarderRepository, daysToFirstCommitReducer) {
    this.onboarderRepository = onboarderRepository;
    this.daysToFirstCommitReducer = daysToFirstCommitReducer;
  }

  async calculate() {
    const onboarders = await this.onboarderRepository.findAll();
    const possibleDaysToFirstCommit = await Promise.all(
      onboarders.map((onboarder) =>
        this.daysToFirstCommitReducer.reduce(onboarder),
      ),
    );

    if (!possibleDaysToFirstCommit.length) {
      return 0;
    }

    const daysToFirstCommit = possibleDaysToFirstCommit.filter((d) => d);

    const meanTimeToFirstCommit =
      daysToFirstCommit.reduce((acc, n) => acc + n) / daysToFirstCommit.length;

    return meanTimeToFirstCommit;
  }
}

module.exports = MeanTimeToFirstCommitCalculator;
