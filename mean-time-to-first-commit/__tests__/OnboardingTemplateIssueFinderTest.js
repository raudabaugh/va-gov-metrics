const { Octokit } = require("octokit");
const OnboardingTemplateIssueFinder = require("../OnboardingTemplateIssueFinder");
const { createOnboardingTemplateIssue } = require("./factories");
const {
  setupMswServer,
  listIssuesForRepoMswRequestHandler,
} = require("./helpers");

const server = setupMswServer();

describe("OnboardingTemplateIssueFinder", () => {
  describe("findAll", () => {
    it("returns all onboarding template issues", async () => {
      const expected = [createOnboardingTemplateIssue()];
      server.use(listIssuesForRepoMswRequestHandler(expected));
      const onboardingTemplateIssueFinder = new OnboardingTemplateIssueFinder(
        new Octokit()
      );

      const actual = await onboardingTemplateIssueFinder.findAll();

      expect(actual).toEqual(expected);
    });

    it("filters out non-onboarding template issues", async () => {
      const expected = [createOnboardingTemplateIssue()];
      server.use(
        listIssuesForRepoMswRequestHandler([
          ...expected,
          createOnboardingTemplateIssue({
            title: "some other kind of issue",
          }),
        ])
      );
      const onboardingTemplateIssueFinder = new OnboardingTemplateIssueFinder(
        new Octokit()
      );

      const actual = await onboardingTemplateIssueFinder.findAll();

      expect(actual).toEqual(expected);
    });
  });
});
