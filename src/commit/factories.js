/* node:coverage disable */

import Commit from "./Commit.js";

export const createCommitDto = (attributes = {}) => ({
  commit: {
    author: {
      date: "2023-07-01T00:00:00Z",
    },
  },
  ...attributes,
});

export const createCommit = (attributes = {}) =>
  new Commit({
    date: new Date("2023-07-01T00:00:00Z"),
    ...attributes,
  });

/* node:coverage disable */
