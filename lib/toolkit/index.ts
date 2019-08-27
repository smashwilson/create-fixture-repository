import path from "path";

import {ActionSequence} from "./action";
import {Repository} from "./api";

export function loadFromFixture(name: string): ActionSequence {
  const repository = new Repository();

  const attempts = [name, path.resolve(__dirname, "../fixtures", name)];
  for (const attempt of attempts) {
    try {
      const fn = require(path.relative(__dirname, attempt)).default;
      fn(repository);
      return repository.finalize();
    } catch (e) {
      if (!/^Cannot find module /.test(e.message)) {
        throw e;
      }
    }
  }
  throw new Error(`Unable to load fixture ${name}`);
}
