const GitHubIssueOnboarderRepository = require("../GitHubIssueOnboarderRepository");
const GitHubOnboardingTemplateIssueFinder = require("../GitHubOnboardingTemplateIssueFinder");
const GitHubOnboarderMapper = require("../GitHubOnboarderMapper");
const { createOnboarder } = require("../../__tests__/factories");
const { createOnboardingTemplateIssue } = require("./factories");

jest.mock("../GitHubOnboardingTemplateIssueFinder");
jest.mock("../GitHubOnboarderMapper");

describe("GitHubIssueOnboarderRepository", () => {
  describe("findAll", () => {
    it("returns a list of onboarders from GitHub", async () => {
      const gitHubOnboardingTemplateIssueFinder =
        new GitHubOnboardingTemplateIssueFinder();
      gitHubOnboardingTemplateIssueFinder.findAll.mockResolvedValue([
        createOnboardingTemplateIssue(),
      ]);
      const gitHubOnboarderMapper = new GitHubOnboarderMapper();
      const expected = [createOnboarder()];
      gitHubOnboarderMapper.map.mockReturnValue(expected);
      const gitHubIssueOnboarderRepository = new GitHubIssueOnboarderRepository(
        gitHubOnboardingTemplateIssueFinder,
        gitHubOnboarderMapper,
      );

      const actual = await gitHubIssueOnboarderRepository.findAll();

      expect(actual).toEqual(expected);
    });
  });
});
