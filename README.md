[![CI](https://github.com/p-ssanders/va-gov-metrics/actions/workflows/ci.yml/badge.svg)](https://github.com/p-ssanders/va-gov-metrics/actions/workflows/ci.yml)
[![License: CC0-1.0](https://img.shields.io/badge/License-CC0_1.0-lightgrey.svg)](LICENSE)

# VA.gov Metrics

## Run

    $ export GITHUB_TOKEN="GitHub PAT with public_repo permission"
    $ npm install
    $ npm start

    > metrics@0.0.1 start
    > node index.js

    Mean Time to First Commit based on Roster: 104.24 days
    Mean Time to First Commit based on GitHub Onboarding Issues: 32.30 days

## Mean Time to First Commit

The `MeanTimeToFirstCommitCalculator` calculates the mean time it takes for someone onboarding to VA.gov (onboarder) to make their first commit, also known as the "Mean Time to First Commit" (MTTFC).

This metric is collected by a scheduled [GitHub Action pipeline](./.github/workflows/mttfc.yml), and the results are committed to [mttfc-report.csv](./mttfc-report.csv).

### Methodology

Each run of the calculator produces two calculations of the MTTFC. The reason for this is that there are currently two distinct sources of onboarder data:

1.  [The VFS Roster](https://docs.google.com/spreadsheets/d/11dpCJjhs007uC6CWJI6djy3OAvjB8rHB65m0Yj8HXIw/edit?usp=sharing)
1.  [VA.gov GitHub Onboarding Template Issues](https://github.com/department-of-veterans-affairs/va.gov-team/issues?q=is%3Aissue+label%3Aplatform-orientation+is%3Aall)

For each onboarder, the calculator finds their first commit after their onboarding began to either [`vets-api`](https://github.com/department-of-veterans-affairs/vets-api) or [`vets-website`](https://github.com/department-of-veterans-affairs/vets-website). The time to first commit is the number of days between the start of their onboarding and their first commit. These days-to-first-commit measurements are then averaged to produce a "mean time to first commit".
