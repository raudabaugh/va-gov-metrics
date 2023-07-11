const { setupServer } = require("msw/node");
const { rest } = require("msw");

const setupMswServer = () => {
  const server = setupServer();

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  return server;
};

const listIssuesForRepoMswRequestHandler = (json) =>
  rest.get(vaGitHubApiUrl("/va.gov-team/issues"), (req, res, ctx) =>
    res(
      ctx.json(
        req.url.searchParams.get("labels") === "platform-orientation"
          ? json
          : [],
      ),
    ),
  );

const listCommitsForVetsWebsiteMswRequestHandler = (onboarder, json) =>
  vaGitHubListCommitsApiMswRequestHandler(
    "/vets-website/commits",
    onboarder,
    json,
  );

const listCommitsForVetsApiMswRequestHandler = (onboarder, json) =>
  vaGitHubListCommitsApiMswRequestHandler("/vets-api/commits", onboarder, json);

const vaGitHubListCommitsApiMswRequestHandler = (
  path,
  { gitHubHandle, onboardingStart },
  json,
) =>
  rest.get(vaGitHubApiUrl(path), (req, res, ctx) =>
    res(
      ctx.json(
        req.url.searchParams.get("author") === gitHubHandle &&
          req.url.searchParams.get("since") === onboardingStart.toString()
          ? json
          : [],
      ),
    ),
  );

const vaGitHubApiUrl = (path) =>
  `https://api.github.com/repos/department-of-veterans-affairs${path}`;

module.exports = {
  setupMswServer,
  listIssuesForRepoMswRequestHandler,
  listCommitsForVetsWebsiteMswRequestHandler,
  listCommitsForVetsApiMswRequestHandler,
};
