const Commit = require("../Commit");

const createCommitDto = (attributes = {}) => ({
  commit: {
    author: {
      date: "2023-07-04T00:00:00Z",
    },
  },
  ...attributes,
});

const createCommit = (attributes = {}) =>
  new Commit({
    date: new Date("2023-07-04T00:00:00Z"),
    ...attributes,
  });

module.exports = {
  createCommitDto,
  createCommit,
};
