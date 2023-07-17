export const createRosterMemberDto = (attributes = {}) => ({
  gitHubHandle: "octocat",
  onboardingStart: "2023-07-01T00:00:00Z",
  ...attributes,
});
