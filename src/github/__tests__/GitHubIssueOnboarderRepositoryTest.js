const GitHubIssueOnboarderRepository = require("../GitHubIssueOnboarderRepository");
const GitHubHandleExtractor = require("../GitHubHandleExtractor");
const { createOnboarder } = require("../../__tests__/factories");
const { createOnboardingTemplateIssue } = require("./factories");
const {
  setupMswServer,
  listIssuesForRepoMswRequestHandler,
} = require("../../__tests__/helpers");
const { Octokit } = require("@octokit/rest");

jest.mock("../GitHubHandleExtractor");

describe("GitHubIssueOnboarderRepository", () => {
  const server = setupMswServer();

  describe("findAll", () => {
    it("returns a list of onboarders from GitHub", async () => {
      const onboardingTemplateIssue = createOnboardingTemplateIssue();
      server.use(listIssuesForRepoMswRequestHandler([onboardingTemplateIssue]));

      const gitHubHandleExtractor = new GitHubHandleExtractor();
      const gitHubHandle = "some-gitHubHandle";
      gitHubHandleExtractor.extractFrom.mockReturnValue(gitHubHandle);

      const gitHubIssueOnboarderRepository = new GitHubIssueOnboarderRepository(
        new Octokit(),
        gitHubHandleExtractor,
      );

      const actual = await gitHubIssueOnboarderRepository.findAll();

      expect(actual).toEqual([
        createOnboarder({
          gitHubHandle,
          onboardingStart: new Date(onboardingTemplateIssue.created_at),
        }),
      ]);
    });

    it("filters out non-onboarding template issues", async () => {
      server.use(
        listIssuesForRepoMswRequestHandler([
          createOnboardingTemplateIssue({
            title: "some other kind of issue",
          }),
        ]),
      );
      const gitHubHandleExtractor = new GitHubHandleExtractor();
      const gitHubIssueOnboarderRepository = new GitHubIssueOnboarderRepository(
        new Octokit(),
        gitHubHandleExtractor,
      );

      const actual = await gitHubIssueOnboarderRepository.findAll();

      expect(actual).toEqual([]);
    });
  });
});
