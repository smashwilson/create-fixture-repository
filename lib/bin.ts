#!/usr/bin/env node
// Entry point for the command-line tool.

import chalk from "chalk";

import {main} from "./index";

main().catch(err => {
  console.error(chalk.red("Oh no: " + err.message));
  console.error(err.stack);
  process.exit(1);
});
