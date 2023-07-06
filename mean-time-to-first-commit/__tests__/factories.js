const createOnboardingTemplateIssue = (attributes = {}) => ({
  title: "Platform Orientation Template",
  body: "GitHub handle*: octocat\n",
  created_at: "2023-07-01T00:00:00Z",
  ...attributes,
});

const createCommit = (attributes = {}) => ({
  commit: {
    author: {
      date: "2023-07-04T00:00:00Z",
    },
  },
  ...attributes,
});

const createOnboarder = (attributes = {}) => ({
  ghHandle: "octocat",
  onboardingStart: "2023-07-01T00:00:00Z",
  ...attributes,
});

module.exports = {
  createOnboardingTemplateIssue,
  createCommit,
  createOnboarder,
};
