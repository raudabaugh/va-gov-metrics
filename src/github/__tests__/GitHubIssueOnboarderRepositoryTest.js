const GitHubIssueOnboarderRepository = require("../GitHubIssueOnboarderRepository");
const { createOnboarder } = require("../../__tests__/factories");
const { createGitHubOnboardingIssueDto } = require("./factories");
const {
  setupMswServer,
  listIssuesForRepoMswRequestHandler,
} = require("../../__tests__/helpers");
const { Octokit } = require("@octokit/rest");

describe("GitHubIssueOnboarderRepository", () => {
  const server = setupMswServer();

  describe("findAll", () => {
    it("returns a list of onboarders from GitHub onboarding template issues", async () => {
      const gitHubOnboardingIssueDto = createGitHubOnboardingIssueDto();
      server.use(
        listIssuesForRepoMswRequestHandler([gitHubOnboardingIssueDto]),
      );

      const gitHubIssueOnboarderRepository = new GitHubIssueOnboarderRepository(
        new Octokit(),
      );

      const onboarders = await gitHubIssueOnboarderRepository.findAll();

      expect(onboarders).toEqual([
        createOnboarder({
          gitHubHandle: "octocat",
          onboardingStart: new Date(gitHubOnboardingIssueDto.created_at),
        }),
      ]);
    });

    it("filters out non-onboarding template issues", async () => {
      server.use(
        listIssuesForRepoMswRequestHandler([
          createGitHubOnboardingIssueDto({
            title: "some other kind of issue",
          }),
        ]),
      );
      const gitHubIssueOnboarderRepository = new GitHubIssueOnboarderRepository(
        new Octokit(),
      );

      const actual = await gitHubIssueOnboarderRepository.findAll();

      expect(actual).toEqual([]);
    });
  });
});
