class TimeToFirstCommitCollector {
  constructor(firstCommitFinder) {
    this.firstCommitFinder = firstCommitFinder;
  }

  async collect(onboarders) {
    let nonCommitters = 0;
    const timesToFirstCommit = [];
    for (const onboarder of onboarders) {
      const gitHubHandle = onboarder.gitHubHandle;
      const onboardingStart = onboarder.onboardingStart;

      const firstCommitToVetsWebsite =
        await this.firstCommitFinder.findFirstCommit(
          "vets-website",
          gitHubHandle,
          onboardingStart
        );
      const firstCommitToVetsApi = await this.firstCommitFinder.findFirstCommit(
        "vets-api",
        gitHubHandle,
        onboardingStart
      );
      const firstCommit = this.#calculateFirstCommitDateTime(
        firstCommitToVetsWebsite,
        firstCommitToVetsApi
      );

      if (isNaN(firstCommit)) {
        nonCommitters++;
        continue;
      }

      const timeToFirstCommit =
        new Date(firstCommit) - new Date(onboardingStart);

      timesToFirstCommit.push(timeToFirstCommit / 1000 / 60 / 60 / 24);
    }

    // console.log("Total Onboarders: %d", onboarders.length);
    // console.log("Total Committers: %d", onboarders.length - nonCommitters);
    // console.log("Percent of Onboarders Committing: %d%%", ((onboarders.length - nonCommitters) / onboarders.length).toFixed(2) * 100);

    return timesToFirstCommit;
  }

  #calculateFirstCommitDateTime(...dates) {
    dates = dates.filter((date) => {
      return !isNaN(date.valueOf());
    });

    return new Date(Math.min(...dates));
  }
}

module.exports = TimeToFirstCommitCollector;
