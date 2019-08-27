import {Repository} from "../toolkit/api";

export default function(repo: Repository) {
  repo.times(3, () => repo.commit());
}
