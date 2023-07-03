export class GithubHandleExtractor {

    extractGitHubHandle(issue) {
        const body = issue.body;
        const ghHandleBeginRegex = /GitHub handle\*?:.*/g;
        const ghHandleEndRegex = /\n/u;

        const ghHandleBeginIndex = body.search(ghHandleBeginRegex);
        if(ghHandleBeginIndex === -1) {
            console.log('Could not find GitHub handle for issue %d', issue.number);
            return issue.user.login;
        }

        const ghHandleEndIndex = body.substring(ghHandleBeginIndex).search(ghHandleEndRegex);
        if(ghHandleBeginIndex === -1) {
            console.log('Could not find GitHub handle for issue %d', issue.number);
            return issue.user.login;
        }

        try {
            let ghHandle = body.substring(ghHandleBeginIndex).substring(0, ghHandleEndIndex).split(':')[1].trim();

            if(!ghHandle) {
                console.log('Could not find GitHub handle for issue %d', issue.number);
                return issue.user.login;
            }
            // GitHub handle is a link like '[my-github-handle](https'
            if(ghHandle.startsWith('[')) {
                ghHandle = ghHandle.split('[')[1].split(']')[0];
            }

            return ghHandle;
        } catch(e) {
            console.log('Could not parse GitHub handle for issue %d', issue.number);
            return issue.user.login;
        }
    }
}