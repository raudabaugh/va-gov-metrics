const Onboarder = require("../Onboarder");

class RosterMember {
  constructor({ gitHubHandle, onboardingStart }) {
    this.gitHubHandle = gitHubHandle;
    this.onboardingStart = onboardingStart;
  }

  toOnboarder() {
    return new Onboarder({
      gitHubHandle: this.gitHubHandle,
      onboardingStart: new Date(this.onboardingStart),
    });
  }
}

module.exports = RosterMember;
