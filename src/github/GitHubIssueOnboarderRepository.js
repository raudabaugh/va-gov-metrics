class GitHubIssueOnboarderRepository {
  constructor(gitHubOnboardingTemplateIssueFinder, gitHubOnboarderMapper) {
    this.gitHubOnboardingTemplateIssueFinder =
      gitHubOnboardingTemplateIssueFinder;
    this.gitHubOnboarderMapper = gitHubOnboarderMapper;
  }

  async findAll() {
    const issues = await this.gitHubOnboardingTemplateIssueFinder.findAll();
    return this.gitHubOnboarderMapper.map(issues);
  }
}

module.exports = GitHubIssueOnboarderRepository;
