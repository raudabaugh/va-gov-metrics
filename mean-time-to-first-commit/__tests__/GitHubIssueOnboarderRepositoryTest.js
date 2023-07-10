const GitHubIssueOnboarderRepository = require("../GitHubIssueOnboarderRepository");
const OnboardingTemplateIssueFinder = require("../OnboardingTemplateIssueFinder");
const OnboarderMapper = require("../OnboarderMapper");
const {
  createOnboardingTemplateIssue,
  createOnboarder,
} = require("./factories");

jest.mock("../OnboardingTemplateIssueFinder");
jest.mock("../OnboarderMapper");

describe("GitHubIssueOnboarderRepository", () => {
  describe("findAll", () => {
    it("returns a list of onboarders from GitHub", async () => {
      const onboardingTemplateIssueFinder = new OnboardingTemplateIssueFinder();
      onboardingTemplateIssueFinder.findAll.mockResolvedValue([
        createOnboardingTemplateIssue(),
      ]);
      const onboarderMapper = new OnboarderMapper();
      const expected = [createOnboarder()];
      onboarderMapper.map.mockReturnValue(expected);
      const gitHubIssueOnboarderRepository = new GitHubIssueOnboarderRepository(
        onboardingTemplateIssueFinder,
        onboarderMapper
      );

      const actual = await gitHubIssueOnboarderRepository.findAll();

      expect(actual).toEqual(expected);
    });
  });
});
