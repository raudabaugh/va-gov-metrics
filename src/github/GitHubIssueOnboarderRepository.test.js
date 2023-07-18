import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { Octokit } from "@octokit/rest";
import GitHubIssueOnboarderRepository from "./GitHubIssueOnboarderRepository.js";
import { createOnboarder } from "../factories.js";
import { createGitHubOnboardingIssueDto } from "./factories.js";
import { setupMswServer, listIssuesForVaGovTeam } from "../msw-helpers.js";

describe("GitHubIssueOnboarderRepository", () => {
  const server = setupMswServer();

  describe("findAll", () => {
    const gitHubIssueOnboarderRepository = new GitHubIssueOnboarderRepository(
      new Octokit(),
    );

    it("returns a list of onboarders from GitHub onboarding issues", async () => {
      const gitHubOnboardingIssueDto = createGitHubOnboardingIssueDto();
      server.use(listIssuesForVaGovTeam([gitHubOnboardingIssueDto]));

      const onboarders = await gitHubIssueOnboarderRepository.findAll();

      assert.deepEqual(onboarders, [
        createOnboarder({
          gitHubHandle: "octocat",
          onboardingStart: new Date(gitHubOnboardingIssueDto.created_at),
        }),
      ]);
    });

    it("ignores non-onboarding issues", async () => {
      server.use(
        listIssuesForVaGovTeam([
          createGitHubOnboardingIssueDto({
            title: "some other kind of issue",
          }),
        ]),
      );

      const onboarders = await gitHubIssueOnboarderRepository.findAll();

      assert.deepEqual(onboarders, []);
    });
  });
});
