import { Octokit } from "octokit";
import { MeanTimeToFirstCommitCalculator } from "./mean-time-to-first-commit/meanTimeToFirstCommitCalculator.js";

const octokit = new Octokit({
    auth: process.env.GH_ACCESS_TOKEN
});

const meanTimeToFirstCommitCalculator = new MeanTimeToFirstCommitCalculator(octokit);
const meanTimeToFirstCommit = await meanTimeToFirstCommitCalculator.calculate();

console.log("Mean Time to First Commit: %d days", meanTimeToFirstCommit);