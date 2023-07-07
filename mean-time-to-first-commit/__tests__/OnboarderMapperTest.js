const OnboarderMapper = require("../OnboarderMapper");
const GitHubHandleExtractor = require("../GitHubHandleExtractor");
const {
  createOnboarder,
  createOnboardingTemplateIssue,
} = require("./factories");

jest.mock("../GitHubHandleExtractor");

describe("OnboarderMapper", () => {
  describe("map", () => {
    it("maps the onboarding template issues to onboarders", () => {
      const gitHubHandleExtractor = new GitHubHandleExtractor();
      const gitHubHandle = "some-gitHubHandle";
      gitHubHandleExtractor.extractFrom.mockReturnValue(gitHubHandle);
      const onboarderMapper = new OnboarderMapper(gitHubHandleExtractor);
      const onboardingTemplateIssue = createOnboardingTemplateIssue();

      const onboarders = onboarderMapper.map([onboardingTemplateIssue]);

      expect(onboarders).toEqual([
        createOnboarder({
          gitHubHandle,
          onboardingStart: onboardingTemplateIssue.created_at,
        }),
      ]);
    });
  });
});
