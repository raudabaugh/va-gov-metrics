class GitHubOnboarderMapper {
  constructor(gitHubHandleExtractor) {
    this.gitHubHandleExtractor = gitHubHandleExtractor;
  }

  map(onboardingTemplateIssues) {
    return onboardingTemplateIssues.map((onboardingTemplateIssue) => {
      const gitHubHandle = this.gitHubHandleExtractor.extractFrom(
        onboardingTemplateIssue
      );
      const onboardingStart = new Date(onboardingTemplateIssue.created_at);

      return { gitHubHandle, onboardingStart };
    });
  }
}

module.exports = GitHubOnboarderMapper;
