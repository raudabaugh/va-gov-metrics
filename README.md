[![CI](https://github.com/p-ssanders/va-gov-metrics/actions/workflows/ci.yml/badge.svg)](https://github.com/p-ssanders/va-gov-metrics/actions/workflows/ci.yml)

# VA.gov Metrics

## Mean Time to First Commit

The `MeanTimeToFirstCommitCalculator` produces two measurements based on two data sources of onboarders:

1.  The VFS Roster
1.  GitHub Onboarding Template Issues

For each onboarder, the calculator finds their first commit to either `vets-api` or `vets-website`, and then calculates their time to first commit in days by finding the difference between their onboarding start date and their first commit date.

The days-to-first-commit measurements are then averaged to produce a "mean time to first commit". Non-committers are not counted towards the average.

    $ export GITHUB_TOKEN="github PAT with public_repo permission"
    $ npm install
    $ npm start

    > metrics@0.0.1 start
    > node index.js

    Mean Time to First Commit based on Roster: 104.24 days
    Mean Time to First Commit based on GitHub Onboarding Issues: 32.30 days
