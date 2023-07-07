class OnboarderMapper {
  constructor(gitHubHandleExtractor) {
    this.gitHubHandleExtractor = gitHubHandleExtractor;
  }

  map(onboardingTemplateIssues) {
    return onboardingTemplateIssues.map((onboardingTemplateIssue) => {
      const ghHandle = this.gitHubHandleExtractor.extractFrom(
        onboardingTemplateIssue
      );
      const onboardingStart = onboardingTemplateIssue.created_at;

      return { ghHandle, onboardingStart: onboardingStart };
    });
  }
}

module.exports = OnboarderMapper;
