import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import GitHubHandleExtractor from "../GitHubHandleExtractor.js";

describe("GitHubHandleExtractor", () => {
  describe("extract", () => {
    const gitHubHandleExtractor = new GitHubHandleExtractor();

    it("extracts a github handle from an onboarding template issue body", () => {
      const body = "GitHub handle*: octocat\n";
      const submitter = "octocat";

      const gitHubHandle = gitHubHandleExtractor.extract(body, submitter);

      assert.equal(gitHubHandle, "octocat");
    });

    it("returns the onboarding template issue submitter's handle when there's no github handle to extract", () => {
      const body = "";
      const submitter = "some-login";

      const gitHubHandle = gitHubHandleExtractor.extract(body, submitter);

      assert.equal(gitHubHandle, "some-login");
    });

    it("returns the onboarding template issue submitter's handle when the github handle is not terminated with newline", () => {
      const body = "GitHub handle*:";
      const submitter = "some-login";

      const gitHubHandle = gitHubHandleExtractor.extract(body, submitter);

      assert.equal(gitHubHandle, "some-login");
    });

    it("returns the onboarding template issue submitter's handle when the github handle is undefined", () => {
      const body = "GitHub handle*:\n";
      const submitter = "some-login";

      const gitHubHandle = gitHubHandleExtractor.extract(body, submitter);

      assert.equal(gitHubHandle, "some-login");
    });

    it("extracts a github handle when the github handle is a link", () => {
      const body = "GitHub handle*: [octocat](https://some-link)\n";
      const submitter = "octocat";

      const gitHubHandle = gitHubHandleExtractor.extract(body, submitter);

      assert.equal(gitHubHandle, "octocat");
    });

    it("removes a leading @ sign from the github handle", () => {
      const body = "GitHub handle*: @octocat\n";
      const submitter = "octocat";

      const gitHubHandle = gitHubHandleExtractor.extract(body, submitter);

      assert.equal(gitHubHandle, "octocat");
    });
  });
});
