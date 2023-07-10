const createCommit = (attributes = {}) => ({
  commit: {
    author: {
      date: "2023-07-04T00:00:00Z",
    },
  },
  ...attributes,
});

module.exports = {
  createCommit,
};
