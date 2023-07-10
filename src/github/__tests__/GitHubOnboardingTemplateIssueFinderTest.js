const { Octokit } = require("octokit");
const GitHubOnboardingTemplateIssueFinder = require("../GitHubOnboardingTemplateIssueFinder");
const { createOnboardingTemplateIssue } = require("./factories");
const {
  setupMswServer,
  listIssuesForRepoMswRequestHandler,
} = require("../../__tests__/helpers");

describe("GitHubOnboardingTemplateIssueFinder", () => {
  const server = setupMswServer();

  describe("findAll", () => {
    it("returns all onboarding template issues", async () => {
      const expected = [createOnboardingTemplateIssue()];
      server.use(listIssuesForRepoMswRequestHandler(expected));
      const gitHubOnboardingTemplateIssueFinder =
        new GitHubOnboardingTemplateIssueFinder(new Octokit());

      const actual = await gitHubOnboardingTemplateIssueFinder.findAll();

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
      const gitHubOnboardingTemplateIssueFinder =
        new GitHubOnboardingTemplateIssueFinder(new Octokit());

      const actual = await gitHubOnboardingTemplateIssueFinder.findAll();

      expect(actual).toEqual(expected);
    });
  });
});
