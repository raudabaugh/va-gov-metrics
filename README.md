[![CI](https://github.com/p-ssanders/va-gov-metrics/actions/workflows/ci.yml/badge.svg)](https://github.com/p-ssanders/va-gov-metrics/actions/workflows/ci.yml)

# VA.gov Metrics

This repository contains scripts to collect metrics on VA.gov.

## Mean Time to First Commit

    $ export GITHUB_TOKEN="github PAT with public_repo permission"
    $ npm install
    $ npm start

    > metrics@0.0.1 start
    > node index.js

    Mean Time to First Commit: 32.30 days
