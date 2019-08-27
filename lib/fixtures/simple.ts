import {Repository} from "../toolkit/api";

export default function(repo: Repository) {
  repo.repo("smashwilson/simple");
  repo.times(3, () => repo.commit());
}
