class MeanTimeToFirstCommitCalculator {
  constructor(onboarderRepository, daysToFirstCommitCollector) {
    this.onboarderRepository = onboarderRepository;
    this.daysToFirstCommitCollector = daysToFirstCommitCollector;
  }

  async calculate() {
    const onboarders = await this.onboarderRepository.findAll();
    const daysToFirstCommit = await this.daysToFirstCommitCollector.collect(
      onboarders
    );

    if (!daysToFirstCommit.length) {
      return 0;
    }

    const meanTimeToFirstCommit =
      daysToFirstCommit.reduce((acc, n) => acc + n) / daysToFirstCommit.length;

    return meanTimeToFirstCommit;
  }
}

module.exports = MeanTimeToFirstCommitCalculator;
