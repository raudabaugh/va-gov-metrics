const Onboarder = require("../Onboarder");

const createOnboarder = (attributes = {}) =>
  new Onboarder({
    gitHubHandle: "octocat",
    onboardingStart: new Date("2023-07-01T00:00:00Z"),
    ...attributes,
  });

module.exports = {
  createOnboarder,
};
