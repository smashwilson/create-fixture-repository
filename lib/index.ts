import {inspect} from "util";

import * as yargs from "yargs";

export async function main() {
  console.log("It's alive");
  console.log(inspect(yargs.argv));
}
