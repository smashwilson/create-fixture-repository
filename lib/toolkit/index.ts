import path from "path";

import {Repository} from "./api";
import {Fixture} from "./fixture";

export function loadFromFixture(name: string): Fixture {
  const repository = new Repository();

  const attempts = [name, path.resolve(__dirname, "../fixtures", name)];
  for (const attempt of attempts) {
    try {
      const fn = require(path.relative(__dirname, attempt)).default;
      fn(repository);
      return new Fixture(repository.finalize());
    } catch (e) {
      if (!/^Cannot find module /.test(e.message)) {
        throw e;
      }
    }
  }
  throw new Error(`Unable to load fixture ${name}`);
}
