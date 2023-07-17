import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import GitHubHandleExtractor from "./GitHubHandleExtractor.js";

describe("GitHubHandleExtractor", () => {
  describe("extract", () => {
    const gitHubHandleExtractor = new GitHubHandleExtractor();

    it("extracts a GitHub handle from an onboarding issue body", () => {
      const body = "GitHub handle*: octocat\n";
      const submitter = "octocat";

      const gitHubHandle = gitHubHandleExtractor.extract(body, submitter);

      assert.equal(gitHubHandle, "octocat");
    });

    it("returns the onboarding issue submitter's handle when there's no GitHub handle to extract", () => {
      const body = "";
      const submitter = "some-login";

      const gitHubHandle = gitHubHandleExtractor.extract(body, submitter);

      assert.equal(gitHubHandle, "some-login");
    });

    it("returns the onboarding issue submitter's handle when the GitHub handle is not terminated with a newline", () => {
      const body = "GitHub handle*:";
      const submitter = "some-login";

      const gitHubHandle = gitHubHandleExtractor.extract(body, submitter);

      assert.equal(gitHubHandle, "some-login");
    });

    it("returns the onboarding issue submitter's handle when the GitHub handle is undefined", () => {
      const body = "GitHub handle*:\n";
      const submitter = "some-login";

      const gitHubHandle = gitHubHandleExtractor.extract(body, submitter);

      assert.equal(gitHubHandle, "some-login");
    });

    it("extracts a GitHub handle when the GitHub handle is a link", () => {
      const body = "GitHub handle*: [octocat](https://some-link)\n";
      const submitter = "octocat";

      const gitHubHandle = gitHubHandleExtractor.extract(body, submitter);

      assert.equal(gitHubHandle, "octocat");
    });

    it("removes a leading @ sign from the GitHub handle", () => {
      const body = "GitHub handle*: @octocat\n";
      const submitter = "octocat";

      const gitHubHandle = gitHubHandleExtractor.extract(body, submitter);

      assert.equal(gitHubHandle, "octocat");
    });
  });
});
