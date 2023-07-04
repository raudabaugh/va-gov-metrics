export class GitHubHandleExtractor {

    extractFrom(onboardingTemplateIssue) {
        const body = onboardingTemplateIssue.body;
        const ghHandleBeginRegex = /GitHub handle\*?:.*/g;
        const ghHandleEndRegex = /\n/u;

        const ghHandleBeginIndex = body.search(ghHandleBeginRegex);
        if(ghHandleBeginIndex === -1) {
            return onboardingTemplateIssue.user.login;
        }

        const ghHandleEndIndex = body.substring(ghHandleBeginIndex).search(ghHandleEndRegex);
        if(ghHandleBeginIndex === -1) {
            return onboardingTemplateIssue.user.login;
        }

        try {
            let ghHandle = body.substring(ghHandleBeginIndex).substring(0, ghHandleEndIndex).split(':')[1].trim();

            if(!ghHandle) {
                return onboardingTemplateIssue.user.login;
            }
            // GitHub handle is a link like '[my-github-handle](https'
            if(ghHandle.startsWith('[')) {
                ghHandle = ghHandle.split('[')[1].split(']')[0];
            }
            if(ghHandle.startsWith('@')) {
                ghHandle = ghHandle.substring(1);
            }

            return ghHandle;
        } catch(e) {
            return onboardingTemplateIssue.user.login;
        }
    }
}