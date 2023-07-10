class MeanTimeToFirstCommitCalculator {
  constructor(
    onboardingTemplateIssueFinder,
    onboarderMapper,
    daysToFirstCommitCollector
  ) {
    this.onboardingTemplateIssueFinder = onboardingTemplateIssueFinder;
    this.onboarderMapper = onboarderMapper;
    this.daysToFirstCommitCollector = daysToFirstCommitCollector;
  }

  async calculate() {
    const onboardingTemplateIssues =
      await this.onboardingTemplateIssueFinder.findAll();
    const onboarders = this.onboarderMapper.map(onboardingTemplateIssues);
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
