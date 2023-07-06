export class MeanTimeToFirstCommitCalculator {

    constructor(onboardingTemplateIssueFinder, onboarderMapper, timeToFirstCommitCollector) {
        this.onboardingTemplateIssueFinder = onboardingTemplateIssueFinder;
        this.onboarderMapper = onboarderMapper;
        this.timeToFirstCommitCollector = timeToFirstCommitCollector;
    }

    async calculate() {
        const onboardingTemplateIssues = await this.onboardingTemplateIssueFinder.findAll();
        const onboarders = this.onboarderMapper.map(onboardingTemplateIssues);
        const timesToFirstCommit = await this.timeToFirstCommitCollector.collect(onboarders);

        const meanTimeToFirstCommit =
            timesToFirstCommit
            .reduce((sum, measurement) => {
                return sum + measurement;
            }, 0) / timesToFirstCommit.length;

        return meanTimeToFirstCommit.toFixed(2);
    }

}