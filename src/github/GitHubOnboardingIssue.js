const GitHubHandleExtractor = require("./GitHubHandleExtractor");
const Onboarder = require("../Onboarder");

class GitHubOnboardingIssue {
  constructor({ issue }) {
    this.issue = issue;
  }

  toOnboarder() {
    const gitHubHandleExtractor = new GitHubHandleExtractor();
    const gitHubHandle = gitHubHandleExtractor.extractFrom(this.issue);
    const onboardingStart = new Date(this.issue.created_at);
    return new Onboarder({ gitHubHandle, onboardingStart });
  }
}

module.exports = GitHubOnboardingIssue;
