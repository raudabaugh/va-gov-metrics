import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { Octokit } from "@octokit/rest";
import { throttling } from "@octokit/plugin-throttling";
import GitHubIssueOnboarderRepository from "./src/github/GitHubIssueOnboarderRepository.js";
import RosterMemberRepository from "./src/roster/RosterMemberRepository.js";
import CommitRepository from "./src/commit/CommitRepository.js";
import MeanTimeToFirstCommitCalculator from "./src/MeanTimeToFirstCommitCalculator.js";

const throttledOctokit = () => {
  const ThrottledOctokit = Octokit.plugin(throttling);

  return new ThrottledOctokit({
    auth: process.env.GITHUB_TOKEN,
    throttle: {
      onRateLimit: (retryAfter, { method, url }, octokit) => {
        octokit.log.warn(
          `Request quota exhausted for request ${method} ${url}, retrying after ${retryAfter}`,
        );
        return true;
      },
      onSecondaryRateLimit: (retryAfter, { method, url }, octokit) => {
        octokit.log.warn(
          `SecondaryRateLimit detected for request ${method} ${url}, retrying after ${retryAfter}`,
        );
        return true;
      },
    },
  });
};

export const main = (roster) => {
  const octokit = throttledOctokit();
  const gitHubIssueOnboarderRepository = new GitHubIssueOnboarderRepository(
    octokit,
  );
  const rosterMemberRepository = new RosterMemberRepository(roster);
  const commitRepository = new CommitRepository(octokit);

  return Promise.all([
    calculateMeanTimeToFirstCommit(
      "Mean Time to First Commit based on GitHub Onboarding Issues (days)",
      gitHubIssueOnboarderRepository,
      commitRepository,
    ),
    calculateMeanTimeToFirstCommit(
      "Mean Time to First Commit based on Roster (days)",
      rosterMemberRepository,
      commitRepository,
    ),
  ]);
};

const calculateMeanTimeToFirstCommit = async (
  label,
  onboarderRepository,
  commitRepository,
) => {
  const meanTimeToFirstCommitCalculator = new MeanTimeToFirstCommitCalculator(
    onboarderRepository,
    commitRepository,
  );

  const meanTimeToFirstCommit =
    await meanTimeToFirstCommitCalculator.calculate();
  console.log(`${label}: ${meanTimeToFirstCommit.toFixed(2)}`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const roster = JSON.parse(await readFile("./src/roster/roster.json"));
  await main(roster);
}
