import { Octokit } from "octokit";

const results = [];

const octokit = new Octokit({
    auth: process.env.GH_ACCESS_TOKEN
});

const onboardingIssues = await getAllOnboardingTemplateIssues(octokit);
for (const onboardingIssue of onboardingIssues) {
    const ghHandle = extractGitHubHandle(onboardingIssue);
    const firstCommitToVetsWebsite = await findFirstCommitTo(octokit, ghHandle, 'vets-website');
    const firstCommitToVetsApi = await findFirstCommitTo(octokit, ghHandle, 'vets-api');
    const firstCommitDateTime = calculateFirstCommitDateTime(firstCommitToVetsWebsite, firstCommitToVetsApi);

    results.push({
        "githubHandle": ghHandle,
        "onboardingStart": onboardingIssue.created_at,
        "firstCommitDateTime": firstCommitDateTime
    });
}

console.log("\nGitHub User, Onboarding Start, First Commit, Time to First Commit");
for (const result of results) {
    console.log("%s, %s, %s, %s", result.githubHandle, result.onboardingStart, result.firstCommitDateTime, (new Date(result.firstCommitDateTime) - new Date(result.onboardingStart)) / 1000 / 60 / 60 / 24);
}

async function getAllOnboardingTemplateIssues(octokit) {
    return (await octokit.paginate(octokit.rest.issues.listForRepo, {
        owner: 'department-of-veterans-affairs',
        repo: 'va.gov-team',
        labels: 'platform-orientation',
        state: 'all',
    })).filter(function(issue) {
        return issue.title.includes('Platform Orientation Template');
    });
}

function extractGitHubHandle(issue) {
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

async function findFirstCommitTo(octokit, ghHandle, repoName) {
    return (await octokit.paginate(octokit.rest.repos.listCommits, {
        owner: 'department-of-veterans-affairs',
        repo: repoName,
        author: ghHandle
    })).map(function(commit) {
        return commit.commit.author.date;
    }).pop();
}

function calculateFirstCommitDateTime(date1, date2) {
    if(date1 && date2)
        return new Date(date1) < new Date(date2) ? date1 : date2;

    if(date1)
        return date1;

    if(date2)
        return date2;
}