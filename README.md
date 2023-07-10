# VA.gov Metrics

This repository contains scripts to collect metrics on VA.gov.

## Mean Time to First Commit

Create a GitHub Access Token with read permissions, and paste it into a file `.token` in the root directory.

Then:

    $ npm start

    > metrics@0.0.1 start
    > GH_ACCESS_TOKEN=`cat .token` node index.js

    Mean Time to First Commit: 32.30 days
