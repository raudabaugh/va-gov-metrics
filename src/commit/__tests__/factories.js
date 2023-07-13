const GitHubCommit = require("../GitHubCommit");

const createCommit = (attributes = {}) => ({
  commit: {
    author: {
      date: "2023-07-04T00:00:00Z",
    },
  },
  ...attributes,
});

const createGitHubCommit = (attributes = {}) =>
  new GitHubCommit({
    date: new Date("2023-07-04T00:00:00Z"),
    ...attributes,
  });

module.exports = {
  createCommit,
  createGitHubCommit,
};
