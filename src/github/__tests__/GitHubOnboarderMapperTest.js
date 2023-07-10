const GitHubOnboarderMapper = require("../GitHubOnboarderMapper");
const GitHubHandleExtractor = require("../GitHubHandleExtractor");
const { createOnboarder } = require("../../__tests__/factories");
const { createOnboardingTemplateIssue } = require("./factories");

jest.mock("../GitHubHandleExtractor");

describe("GitHubOnboarderMapper", () => {
  describe("map", () => {
    it("maps the onboarding template issues to onboarders", () => {
      const gitHubHandleExtractor = new GitHubHandleExtractor();
      const gitHubHandle = "some-gitHubHandle";
      gitHubHandleExtractor.extractFrom.mockReturnValue(gitHubHandle);
      const gitHubOnboarderMapper = new GitHubOnboarderMapper(
        gitHubHandleExtractor
      );
      const onboardingTemplateIssue = createOnboardingTemplateIssue();

      const onboarders = gitHubOnboarderMapper.map([onboardingTemplateIssue]);

      expect(onboarders).toEqual([
        createOnboarder({
          gitHubHandle,
          onboardingStart: new Date(onboardingTemplateIssue.created_at),
        }),
      ]);
    });
  });
});
