import { before, afterEach, after } from "node:test";
import { setupServer } from "msw/node";
import { rest } from "msw";

export const setupMswServer = () => {
  const server = setupServer();

  before(() => server.listen());
  afterEach(() => server.resetHandlers());
  after(() => server.close());

  return server;
};

export const listIssuesForVaGovTeam = (json) =>
  rest.get(vaGitHubApiUrl("/va.gov-team/issues"), (req, res, ctx) =>
    res(
      ctx.json(
        req.url.searchParams.get("labels") === "platform-orientation" &&
          req.url.searchParams.get("state") === "all"
          ? json
          : [],
      ),
    ),
  );

export const listCommitsForVetsWebsite = (onboarder, json) =>
  vaGitHubListCommitsApiMswRequestHandler(
    "/vets-website/commits",
    onboarder,
    json,
  );

export const listCommitsForVetsApi = (onboarder, json) =>
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
