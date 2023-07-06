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
    const timesToFirstCommit = await this.timeToFirstCommitCollector.collect(
      onboarders
    );

    if (timesToFirstCommit.length === 0) {
      return 0;
    }

    const totalTimeToFirstCommit = timesToFirstCommit.reduce(
      (sum, firstCommitTime) => {
        return sum + firstCommitTime;
      },
      0
    );

    const meanTimeToFirstCommit =
      totalTimeToFirstCommit / timesToFirstCommit.length;

    return meanTimeToFirstCommit;
  }
}

module.exports = MeanTimeToFirstCommitCalculator;
