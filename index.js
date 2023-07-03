import { MeanTimeToFirstCommitCalculator } from "./mean-time-to-first-commit/meanTimeToFirstCommitCalculator.js";

const meanTimeToFirstCommitCalculator = new MeanTimeToFirstCommitCalculator();
const meanTimeToFirstCommit = await meanTimeToFirstCommitCalculator.calculate();

console.log("Mean Time to First Commit: %d", meanTimeToFirstCommit);