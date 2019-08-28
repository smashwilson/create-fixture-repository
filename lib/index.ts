import yargs from "yargs";

import {loadFromFixture} from "./toolkit";
import {log} from "./toolkit/log";

export async function main() {
  const args = yargs
    .option("fixture", {
      alias: "f",
      string: true,
      description: "Name or path of the fixture function module to use",
      demandOption: true,
    })
    .option("remote", {
      alias: "r",
      string: true,
      description: "Remote URL to push to",
    })
    .option("verbose", {
      alias: "v",
      boolean: true,
      description: "Emit more detailed logging information",
      default: false,
    })
    .parse(process.argv.slice(2));

  if (args.verbose) {
    log.setLevel("verbose");
  }

  log.debug("Loading fixture.", {fixture: args.fixture});
  const actions = loadFromFixture(args.fixture, {
    remoteURL: args.remote,
  });

  log.debug("Recreating fixture state.");
  await actions.play();
}
