import {inspect} from "util";

import chalk, {Chalk} from "chalk";

type LogLevel = "verbose" | "info" | "quiet";
let currentLevel: LogLevel = "info";

function show(
  color: Chalk,
  level: string,
  message: string,
  payload: any = null
) {
  let prefix = "";
  for (let i = 0; i < 5 - level.length; i++) {
    prefix += "·";
  }
  prefix += level;
  prefix += ":";
  console.log(color.bold(prefix) + " " + message);
  if (typeof payload === "string") {
    console.log("\n" + payload);
  } else if (payload !== null) {
    console.log(inspect(payload, {depth: 10, colors: true}));
  }
}

export const log = {
  setLevel(level: LogLevel): void {
    currentLevel = level;
  },

  debug(message: string, payload: any = null): void {
    if (currentLevel === "info" || currentLevel === "quiet") return;
    show(chalk.blue, "DEBUG", message, payload);
  },

  info(message: string, payload: any = null): void {
    if (currentLevel === "quiet") return;
    show(chalk.cyan, "INFO", message, payload);
  },

  warn(message: string, payload: any = null) {
    show(chalk.yellow, "WARN", message, payload);
  },

  error(message: string, payload: any = null) {
    show(chalk.red, "ERROR", message, payload);
  },
};
