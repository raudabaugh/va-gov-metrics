class MeanTimeToFirstCommitCalculator {
  constructor(onboarderRepository, commitRepository) {
    this.onboarderRepository = onboarderRepository;
    this.commitRepository = commitRepository;
  }

  async calculate() {
    const onboarders = await this.onboarderRepository.findAll();
    const possibleDaysToFirstCommit = await Promise.all(
      onboarders.map(async (onboarder) => {
        const possibleFirstCommits = await Promise.all(
          ["vets-website", "vets-api"].map((repo) =>
            this.commitRepository.findFirstCommit(repo, onboarder),
          ),
        );
        return onboarder.daysToFirstCommit(possibleFirstCommits);
      }),
    );

    if (!possibleDaysToFirstCommit.length) {
      return 0;
    }

    const daysToFirstCommit = possibleDaysToFirstCommit.filter((d) => d);
    if (!daysToFirstCommit.length) {
      return 0;
    }

    const meanTimeToFirstCommit =
      daysToFirstCommit.reduce((acc, n) => acc + n) / daysToFirstCommit.length;

    return meanTimeToFirstCommit;
  }
}

module.exports = MeanTimeToFirstCommitCalculator;
