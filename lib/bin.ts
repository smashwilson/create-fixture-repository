#!/usr/bin/env node
// Entry point for the command-line tool.

import {main} from "./index";
import {log} from "./toolkit/log";
import {isGitError} from "./toolkit/git";

main().catch(err => {
  const payload: any = {stack: err.stack};
  if (isGitError(err)) {
    if (err.code !== null) {
      payload.code = err.code;
    } else {
      payload.signal = err.signal;
    }
    payload.stdout = err.stdout;
    payload.stderr = err.stderr;
  }
  log.error("Oh no", payload);
  process.exit(1);
});
