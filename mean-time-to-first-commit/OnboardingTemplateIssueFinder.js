class OnboardingTemplateIssueFinder {
  constructor(octokit) {
    this.octokit = octokit;
  }

  async findAll() {
    const onboardingTemplateIssues = (
      await this.octokit.paginate(this.octokit.rest.issues.listForRepo, {
        owner: "department-of-veterans-affairs",
        repo: "va.gov-team",
        labels: "platform-orientation",
        state: "all",
      })
    ).filter(function (issue) {
      return issue.title.includes("Platform Orientation Template");
    });

    return onboardingTemplateIssues;
  }
}

module.exports = OnboardingTemplateIssueFinder;
