const GitHubHandleExtractor = require("../GitHubHandleExtractor");
const { createOnboardingIssue } = require("./factories");

describe("GitHubHandleExtractor", () => {
  describe("extractFrom", () => {
    const gitHubHandleExtractor = new GitHubHandleExtractor();

    it("extracts a github handle from an onboarding template issue body", () => {
      const onboardingIssue = createOnboardingIssue({
        body: "GitHub handle*: octocat\n",
      });

      const gitHubHandle = gitHubHandleExtractor.extractFrom(onboardingIssue);

      expect(gitHubHandle).toBe("octocat");
    });

    it("returns the onboarding template issue submitter's handle when there's no github handle to extract", () => {
      const onboardingIssue = createOnboardingIssue({
        body: "",
        user: {
          login: "some-login",
        },
      });

      const gitHubHandle = gitHubHandleExtractor.extractFrom(onboardingIssue);

      expect(gitHubHandle).toBe("some-login");
    });

    it("returns the onboarding template issue submitter's handle when the github handle is not terminated with newline", () => {
      const onboardingIssue = createOnboardingIssue({
        body: "GitHub handle*:",
        user: {
          login: "some-login",
        },
      });

      const gitHubHandle = gitHubHandleExtractor.extractFrom(onboardingIssue);

      expect(gitHubHandle).toBe("some-login");
    });

    it("returns the onboarding template issue submitter's handle when the github handle is undefined", () => {
      const onboardingIssue = createOnboardingIssue({
        body: "GitHub handle*:\n",
        user: {
          login: "some-login",
        },
      });

      const gitHubHandle = gitHubHandleExtractor.extractFrom(onboardingIssue);

      expect(gitHubHandle).toBe("some-login");
    });

    it("extracts a github handle when the github handle is a link", () => {
      const onboardingIssue = createOnboardingIssue({
        body: "GitHub handle*: [octocat](https://some-link)\n",
      });

      const gitHubHandle = gitHubHandleExtractor.extractFrom(onboardingIssue);

      expect(gitHubHandle).toBe("octocat");
    });

    it("removes a leading @ sign from the github handle", () => {
      const onboardingIssue = createOnboardingIssue({
        body: "GitHub handle*: @octocat\n",
      });

      const gitHubHandle = gitHubHandleExtractor.extractFrom(onboardingIssue);

      expect(gitHubHandle).toBe("octocat");
    });
  });
});
