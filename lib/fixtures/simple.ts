import {Repository} from "../toolkit/api";

export default function(repo: Repository) {
  repo.times(3, () => repo.commit());

  repo.branch("something", () => {
    repo.times(2, () => repo.commit());
  });

  repo.commit({message: "Fixed commit message here"});
  repo.times(4, () => repo.commit());
}
