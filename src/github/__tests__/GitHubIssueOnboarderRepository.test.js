import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { Octokit } from "@octokit/rest";
import GitHubIssueOnboarderRepository from "../GitHubIssueOnboarderRepository.js";
import { createOnboarder } from "../../__tests__/factories.js";
import { createGitHubOnboardingIssueDto } from "./factories.js";
import {
  setupMswServer,
  listIssuesForRepoMswRequestHandler,
} from "../../__tests__/helpers.js";

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

      assert.deepEqual(onboarders, [
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

      assert.deepEqual(actual, []);
    });
  });
});
