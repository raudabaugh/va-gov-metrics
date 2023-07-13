const GitHubIssueOnboarderRepository = require("../GitHubIssueOnboarderRepository");
const GitHubOnboardingIssue = require("../GitHubOnboardingIssue");
const { createOnboarder } = require("../../__tests__/factories");
const { createGitHubOnboardingIssueDto } = require("./factories");
const {
  setupMswServer,
  listIssuesForRepoMswRequestHandler,
} = require("../../__tests__/helpers");
const { Octokit } = require("@octokit/rest");

jest.mock("../GitHubOnboardingIssue");

describe("GitHubIssueOnboarderRepository", () => {
  const server = setupMswServer();

  describe("findAll", () => {
    const onboarder = createOnboarder();

    beforeEach(() => {
      GitHubOnboardingIssue.mockImplementation(() => ({
        toOnboarder: jest.fn().mockReturnValue(onboarder),
      }));
    });

    it("returns a list of onboarders from GitHub onboarding template issues", async () => {
      const gitHubOnboardingIssueDto = createGitHubOnboardingIssueDto();
      server.use(
        listIssuesForRepoMswRequestHandler([gitHubOnboardingIssueDto]),
      );

      const gitHubIssueOnboarderRepository = new GitHubIssueOnboarderRepository(
        new Octokit(),
      );

      const onboarders = await gitHubIssueOnboarderRepository.findAll();

      expect(GitHubOnboardingIssue).toHaveBeenCalledWith({
        issue: gitHubOnboardingIssueDto,
      });
      expect(onboarders).toEqual([onboarder]);
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
