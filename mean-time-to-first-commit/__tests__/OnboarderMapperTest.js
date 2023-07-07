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
      const ghHandle = "some-ghhandle";
      gitHubHandleExtractor.extractFrom.mockReturnValue(ghHandle);
      const onboarderMapper = new OnboarderMapper(gitHubHandleExtractor);
      const onboardingTemplateIssue = createOnboardingTemplateIssue();

      const onboarders = onboarderMapper.map([onboardingTemplateIssue]);

      expect(onboarders).toEqual([
        createOnboarder({
          ghHandle,
          onboardingStart: onboardingTemplateIssue.created_at,
        }),
      ]);
    });
  });
});
