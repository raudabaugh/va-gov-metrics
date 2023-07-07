class MeanTimeToFirstCommitCalculator {
  constructor(
    onboardingTemplateIssueFinder,
    onboarderMapper,
    timeToFirstCommitCollector
  ) {
    this.onboardingTemplateIssueFinder = onboardingTemplateIssueFinder;
    this.onboarderMapper = onboarderMapper;
    this.timeToFirstCommitCollector = timeToFirstCommitCollector;
  }

  async calculate() {
    const onboardingTemplateIssues =
      await this.onboardingTemplateIssueFinder.findAll();
    const onboarders = this.onboarderMapper.map(onboardingTemplateIssues);
    const daysToFirstCommit = await this.timeToFirstCommitCollector.collect(
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
