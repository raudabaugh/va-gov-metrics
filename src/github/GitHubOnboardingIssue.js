const GitHubHandleExtractor = require("./GitHubHandleExtractor");
const Onboarder = require("../Onboarder");

class GitHubOnboardingIssue {
  constructor({
    issue: {
      body,
      user: { login },
      created_at,
    },
  }) {
    this.body = body;
    this.submitter = login;
    this.submittedAt = created_at;
  }

  toOnboarder() {
    const gitHubHandleExtractor = new GitHubHandleExtractor();
    const gitHubHandle = gitHubHandleExtractor.extract(
      this.body,
      this.submitter,
    );
    const onboardingStart = new Date(this.submittedAt);
    return new Onboarder({ gitHubHandle, onboardingStart });
  }
}

module.exports = GitHubOnboardingIssue;
