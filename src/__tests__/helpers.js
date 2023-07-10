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
  vaGitHubApiRequestHandler("/va.gov-team/issues", json);

const listCommitsForVetsWebsiteMswRequestHandler = (json) =>
  vaGitHubApiRequestHandler("/vets-website/commits", json);

const listCommitsForVetsApiMswRequestHandler = (json) =>
  vaGitHubApiRequestHandler("/vets-api/commits", json);

const vaGitHubApiRequestHandler = (path, json) =>
  rest.get(
    `https://api.github.com/repos/department-of-veterans-affairs${path}`,
    (req, res, ctx) => res(ctx.json(json)),
  );

module.exports = {
  setupMswServer,
  listIssuesForRepoMswRequestHandler,
  listCommitsForVetsWebsiteMswRequestHandler,
  listCommitsForVetsApiMswRequestHandler,
};
