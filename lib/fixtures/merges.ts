import {Repository} from "../toolkit/api";

export default async function(repo: Repository) {
  repo.branch("direct-update", () => {
    repo.times(3, () => repo.commit());
    repo.push();
    repo.times(2, () => repo.commit());
  });

  repo.branch("tip-merge-base", () => {
    repo.times(3, () => repo.commit());
    repo.push();
  });

  repo.branch("tip-merge-head", () => {
    repo.times(2, () => repo.commit());
    repo.push();
    repo.merge("merge-base");
  });

  repo.branch("intermediate-merge-base", () => {
    repo.times(2, () => repo.commit());
    repo.branch("intermediate-merge-middle");
    repo.times(2, () => repo.commit());
    repo.push();
  });

  repo.branch("intermediate-merge-head", () => {
    repo.times(2, () => repo.commit());
    repo.merge("intermediate-merge-middle");
    repo.times(2, () => repo.commit());
    repo.push();
    repo.merge("intermediate-merge-base");
  });
}
