import Onboarder from "../Onboarder.js";

export default class RosterMemberRepository {
  constructor(roster) {
    this.roster = roster;
  }

  async findAll() {
    return this.roster.map(
      ({ gitHubHandle, onboardingStart }) =>
        new Onboarder({
          gitHubHandle: gitHubHandle,
          onboardingStart: new Date(onboardingStart),
        }),
    );
  }
}
