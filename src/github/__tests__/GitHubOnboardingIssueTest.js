const GitHubHandleExtractor = require("../GitHubHandleExtractor");
const { createOnboarder } = require("../../__tests__/factories");
const { createGitHubOnboardingIssue } = require("./factories");

jest.mock("../GitHubHandleExtractor");

describe("GitHubOnboardingIssue", () => {
  describe("toOnboarder", () => {
    const gitHubHandle = "some-gitHubHandle";

    beforeEach(() => {
      GitHubHandleExtractor.mockImplementation(() => ({
        extractFrom: jest.fn().mockReturnValue(gitHubHandle),
      }));
    });

    it("converts itself into an Onboarder", () => {
      const gitHubOnboardingIssue = createGitHubOnboardingIssue();

      const onboarder = gitHubOnboardingIssue.toOnboarder();

      expect(onboarder).toEqual(
        createOnboarder({
          gitHubHandle,
          onboardingStart: new Date(gitHubOnboardingIssue.issue.created_at),
        }),
      );
    });
  });
});
