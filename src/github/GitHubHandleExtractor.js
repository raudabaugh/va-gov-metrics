const NO_MATCH = -1;

export const extractGitHubHandle = (body, submitter) => {
  const gitHubHandleBeginRegex = /GitHub handle\*?:.*/;
  const gitHubHandleEndRegex = /\n/;

  const gitHubHandleBeginIndex = body.search(gitHubHandleBeginRegex);
  if (gitHubHandleBeginIndex === NO_MATCH) {
    return submitter;
  }

  const gitHubHandleEndIndex = body
    .substring(gitHubHandleBeginIndex)
    .search(gitHubHandleEndRegex);
  if (gitHubHandleEndIndex === NO_MATCH) {
    return submitter;
  }

  let gitHubHandle = body
    .substring(gitHubHandleBeginIndex)
    .substring(0, gitHubHandleEndIndex)
    .split(":")[1]
    .trim();

  if (!gitHubHandle) {
    return submitter;
  }
  // GitHub handle is a link like '[my-GitHub-handle](https'
  if (gitHubHandle.startsWith("[")) {
    gitHubHandle = gitHubHandle.split("[")[1].split("]")[0];
  }
  if (gitHubHandle.startsWith("@")) {
    gitHubHandle = gitHubHandle.substring(1);
  }

  return gitHubHandle;
};
