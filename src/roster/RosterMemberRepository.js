const roster = require("./roster.json");
const RosterMember = require("./RosterMember");

class RosterMemberRepository {
  async findAll() {
    return roster.map((attributes) =>
      new RosterMember(attributes).toOnboarder(),
    );
  }
}

module.exports = RosterMemberRepository;
