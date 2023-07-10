class GitHubIssueOnboarderRepository {
  constructor(onboardingTemplateIssueFinder, onboarderMapper) {
    this.onboardingTemplateIssueFinder = onboardingTemplateIssueFinder;
    this.onboarderMapper = onboarderMapper;
  }

  async findAll() {
    const onboardingTemplateIssues =
      await this.onboardingTemplateIssueFinder.findAll();
    return this.onboarderMapper.map(onboardingTemplateIssues);
  }
}

module.exports = GitHubIssueOnboarderRepository;
