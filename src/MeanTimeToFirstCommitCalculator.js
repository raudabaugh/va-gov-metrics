export default class MeanTimeToFirstCommitCalculator {
  constructor(onboarderRepository, commitRepository) {
    this.onboarderRepository = onboarderRepository;
    this.commitRepository = commitRepository;
  }

  async calculate() {
    const onboarders = await this.onboarderRepository.findAll();
    const possibleDaysToFirstCommit = await Promise.all(
      onboarders.map(async (onboarder) => {
        const possibleCommits = await Promise.all(
          ["vets-website", "vets-api"].map((repo) =>
            this.commitRepository.findFirstBy(repo, onboarder)
          )
        );
        const commits = possibleCommits.filter((commit) => commit);
        return onboarder.daysToFirstCommit(commits);
      })
    );

    const daysToFirstCommit = possibleDaysToFirstCommit.filter((days) => days);
    if (!daysToFirstCommit.length) {
      return 0;
    }

    const meanTimeToFirstCommit =
      daysToFirstCommit.reduce((total, days) => total + days) /
      daysToFirstCommit.length;

    return meanTimeToFirstCommit;
  }
}
