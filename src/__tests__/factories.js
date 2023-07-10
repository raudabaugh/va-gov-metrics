const createOnboarder = (attributes = {}) => ({
  gitHubHandle: "octocat",
  onboardingStart: new Date("2023-07-01T00:00:00Z"),
  ...attributes,
});

module.exports = {
  createOnboarder,
};
