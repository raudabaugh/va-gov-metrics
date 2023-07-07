class OnboarderMapper {
  constructor(gitHubHandleExtractor) {
    this.gitHubHandleExtractor = gitHubHandleExtractor;
  }

  map(onboardingTemplateIssues) {
    return onboardingTemplateIssues.map((onboardingTemplateIssue) => {
      const gitHubHandle = this.gitHubHandleExtractor.extractFrom(
        onboardingTemplateIssue
      );
      const onboardingStart = onboardingTemplateIssue.created_at;

      return { gitHubHandle, onboardingStart: onboardingStart };
    });
  }
}

module.exports = OnboarderMapper;
