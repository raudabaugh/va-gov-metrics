const roster = require("./roster.json");

class RosterOnboarderRepository {
  async findAll() {
    return roster.map((onboarder) => ({
      ...onboarder,
      onboardingStart: new Date(onboarder.onboardingStart),
    }));
  }
}

module.exports = RosterOnboarderRepository;
