#!/usr/bin/env node
// Entry point for the command-line tool.

import chalk from "chalk";

import {main} from "./index";
import {isGitError} from "./toolkit/git";

main().catch(err => {
  console.error(chalk.red("Oh no: " + err.message));
  if (isGitError(err)) {
    if (err.code !== null) {
      console.error(chalk.red("code: ") + err.code);
    } else {
      console.error(chalk.red("signal: ") + err.signal);
    }
    console.error(chalk.red("stdout:\n") + err.stdout);
    console.error(chalk.red("stderr:\n") + err.stderr);
  }
  console.error(err.stack);
  process.exit(1);
});
