class GitHubIssueOnboarderRepository {
  constructor(octokit, gitHubHandleExtractor) {
    this.octokit = octokit;
    this.gitHubHandleExtractor = gitHubHandleExtractor;
  }

  async findAll() {
    const issues = await this.octokit.paginate(
      this.octokit.rest.issues.listForRepo,
      {
        owner: "department-of-veterans-affairs",
        repo: "va.gov-team",
        labels: "platform-orientation",
        state: "all",
      },
    );

    const onboardingTemplateIssues = issues.filter(({ title }) =>
      title.includes("Platform Orientation Template"),
    );

    return onboardingTemplateIssues.map((onboardingTemplateIssue) => {
      const gitHubHandle = this.gitHubHandleExtractor.extractFrom(
        onboardingTemplateIssue,
      );
      const onboardingStart = new Date(onboardingTemplateIssue.created_at);

      return { gitHubHandle, onboardingStart };
    });
  }
}

module.exports = GitHubIssueOnboarderRepository;
