const RosterMember = require("../RosterMember");

const createRosterMember = (attributes = {}) =>
  new RosterMember({
    gitHubHandle: "octocat",
    onboardingStart: "2023-07-01T00:00:00Z",
    ...attributes,
  });

module.exports = {
  createRosterMember,
};
