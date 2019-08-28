import path from "path";

import {log} from "./log";
import {Repository} from "./api";
import {Fixture, IFixtureOptions} from "./fixture";

export function loadFromFixture(
  name: string,
  options: IFixtureOptions
): Fixture {
  const repository = new Repository();

  const attempts = [name, path.resolve(__dirname, "../fixtures", name)];
  for (const attempt of attempts) {
    try {
      const fn = require(path.relative(__dirname, attempt)).default;
      fn(repository);

      log.debug("Fixture loaded.", {fixturePath: attempt});
      return new Fixture(repository.finalize(), options);
    } catch (e) {
      if (!/^Cannot find module /.test(e.message)) {
        throw e;
      }
    }
  }
  throw new Error(`Unable to load fixture ${name}`);
}
