const roster = require("./roster.json");
const Onboarder = require("../Onboarder");

class RosterMemberRepository {
  async findAll() {
    return roster.map(
      ({ gitHubHandle, onboardingStart }) =>
        new Onboarder({
          gitHubHandle: gitHubHandle,
          onboardingStart: new Date(onboardingStart),
        }),
    );
  }
}

module.exports = RosterMemberRepository;
