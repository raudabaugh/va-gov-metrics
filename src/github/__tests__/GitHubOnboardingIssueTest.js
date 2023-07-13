const GitHubHandleExtractor = require("../GitHubHandleExtractor");
const { createOnboarder } = require("../../__tests__/factories");
const {
  createGitHubOnboardingIssue,
  createGitHubOnboardingIssueDto,
} = require("./factories");

jest.mock("../GitHubHandleExtractor");

describe("GitHubOnboardingIssue", () => {
  describe("toOnboarder", () => {
    const gitHubHandle = "some-gitHubHandle";
    const extract = jest.fn().mockReturnValue(gitHubHandle);

    beforeEach(() => {
      GitHubHandleExtractor.mockImplementation(() => ({
        extract,
      }));
    });

    it("converts itself into an Onboarder", () => {
      const gitHubOnboardingIssueDto = createGitHubOnboardingIssueDto();
      const gitHubOnboardingIssue = createGitHubOnboardingIssue({
        issue: gitHubOnboardingIssueDto,
      });

      const onboarder = gitHubOnboardingIssue.toOnboarder();

      expect(extract).toHaveBeenCalledWith(
        gitHubOnboardingIssueDto.body,
        gitHubOnboardingIssueDto.user.login,
      );
      expect(onboarder).toEqual(
        createOnboarder({
          gitHubHandle,
          onboardingStart: new Date(gitHubOnboardingIssueDto.created_at),
        }),
      );
    });
  });
});
