import {Repository} from "../toolkit/api";

export default function(repo: Repository) {
  repo.times(3, () => repo.commit());

  repo.branch("something", () => {
    repo.times(2, () => repo.commit());
    repo.push();
    repo.branch("other", () => {
      repo.times(3, () => repo.commit());
    });
    repo.branch("third", () => {
      repo.times(2, () => repo.commit());
      repo.merge("other");
      repo.times(2, () => repo.commit());
    });
    repo.times(2, () => repo.commit());
  });

  repo.createFile("subdir/fixed-1.txt");
  repo.createFile("fixed-0.txt", {}, f => {
    f.line("line 0");
    f.line("line 1");
    f.lines(3);
  });
  repo.commit({message: "Fixed commit message here"});

  repo.changeFile("fixed-0.txt", {}, f => {
    f.line(1, "different line 1");
  });

  repo.times(4, () => repo.commit());
  repo.push();
}
