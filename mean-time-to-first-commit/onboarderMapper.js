export class OnboarderMapper {

    constructor(gitHubHandleExtractor) {
        this.gitHubHandleExtractor = gitHubHandleExtractor;
    }

    map(onboardingTemplateIssues) {
        const onboarders = [];
        for (const onboardingTemplateIssue of onboardingTemplateIssues) {
            const ghHandle = this.gitHubHandleExtractor.extractFrom(onboardingTemplateIssue);
            const onboardingStart = onboardingTemplateIssue.created_at;

            onboarders.push({"ghHandle": ghHandle, "onboardingStart": onboardingStart});
        }

        return onboarders;
    }

}