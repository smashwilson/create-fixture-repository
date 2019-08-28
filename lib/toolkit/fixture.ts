import fs from "fs-extra";

import {ActionSequence} from "./action";
import {Context} from "./context";
import {git} from "./git";
import {log} from "./log";

export interface IFixtureOptions {
  remoteURL?: string;
}

export class Fixture {
  constructor(
    private readonly actions: ActionSequence,
    private readonly options: IFixtureOptions
  ) {
    //
  }

  async play() {
    const context = new Context(this.options.remoteURL);
    await this.initialize(context);
    await this.actions.enact(context);
    await this.report();
  }

  private async initialize(context: Context) {
    await fs.emptyDir(".");
    await git("init");
    if (context.remoteURL) {
      await git("remote", "add", context.currentRemote, context.remoteURL);
    }
  }

  private async report() {
    const structure = await git(
      "-c",
      "color.ui=always",
      "log",
      "--color",
      "--oneline",
      "--graph",
      "--decorate",
      "--all"
    );
    log.info("Repository structure created.", structure.stdout);
    const remotes = await git("-c", "color.ui=always", "remote", "-v");
    log.info("Repository remotes.", remotes.stdout);
  }
}
