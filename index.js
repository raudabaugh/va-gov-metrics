import { Octokit } from "octokit";

const octokit = new Octokit({
    auth: process.env.GH_ACCESS_TOKEN
});

const platformOrientationTemplates = (await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner: 'department-of-veterans-affairs',
    repo: 'va.gov-team',
    labels: 'platform-orientation',
    state: 'all',
})).filter(function(issue) {
    return issue.title.includes('Platform Orientation Template');
});

for (const issue of platformOrientationTemplates) {
    const ghHandle = extractGitHubHandle(issue);
    if(ghHandle === 'Not Found') continue;

    console.log("GitHub User %s began onboarding on %s", ghHandle, issue.created_at);
}

function extractGitHubHandle(issue) {
    const body = issue.body;
    const ghHandleBeginRegex = /GitHub handle\*?:.*/g;
    const ghHandleEndRegex = /\n/u;

    const ghHandleBeginIndex = body.search(ghHandleBeginRegex);
    if(ghHandleBeginIndex === -1) {
        console.log('Could not find GitHub handle for issue %d', issue.number);
        return 'Not Found';
    }

    const ghHandleEndIndex = body.substring(ghHandleBeginIndex).search(ghHandleEndRegex);
    if(ghHandleBeginIndex === -1) {
        console.log('Could not find GitHub handle for issue %d', issue.number);
        return 'Not Found';
    }

    try {
        const ghHandle = body.substring(ghHandleBeginIndex).substring(0, ghHandleEndIndex).split(':')[1].trim();

        if(!ghHandle) {
            console.log('Could not find GitHub handle for issue %d', issue.number);
            return 'Not Found';
        }

        return ghHandle;
    } catch(e) {
        console.log('Could not parse GitHub handle for issue %d', issue.number);
        return 'Not Found';
    }
}