import yargs from "yargs";

import {loadFromFixture} from "./toolkit";

export async function main() {
  const args = yargs
    .option("fixture", {
      alias: "f",
      string: true,
      description: "Name or path of the fixture function module to use",
      demandOption: true,
    })
    .parse(process.argv.slice(2));

  const actions = loadFromFixture(args.fixture);
  await actions.play();
}
