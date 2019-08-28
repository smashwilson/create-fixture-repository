import {loremIpsum} from "lorem-ipsum";
import fs from "fs-extra";

import {git} from "./git";
import {Context} from "./context";

abstract class Action {
  abstract enact(context: Context): Promise<void>;
}

export class BranchAction extends Action {
  constructor(private readonly name: string) {
    super();
  }

  async enact(context: Context) {
    await git("checkout", "-b", this.name);
    context.currentBranch = this.name;
  }
}

export class CheckoutAction extends Action {
  constructor(private readonly name: string) {
    super();
  }

  async enact(context: Context) {
    await git("checkout", this.name);
    context.currentBranch = this.name;
  }
}

interface IFullCommitOptions {
  message: string;
  empty: boolean;
}

export type ICommitOptions = Partial<IFullCommitOptions>;

export class CommitAction extends Action {
  private readonly options: IFullCommitOptions;

  constructor(options: ICommitOptions = {}) {
    super();

    this.options = {
      message: loremIpsum({units: "sentences", count: 1}),
      empty: false,
      ...options,
    };
  }

  async enact(context: Context) {
    if (!this.options.empty && !context.madeChanges) {
      const fileName = context.fileName();
      await fs.writeFile(fileName, loremIpsum({count: 2, units: "paragraph"}), {
        encoding: "utf8",
      });
      await git("add", fileName);
      context.madeChanges = true;
    }

    const args = ["commit"];
    if (this.options.empty && !context.madeChanges) {
      args.push("--allow-empty");
    }
    args.push("-m");
    args.push(this.options.message);
    await git(...args);

    context.madeChanges = false;
  }
}

export class MergeAction extends Action {
  constructor(private readonly name: string) {
    super();
  }

  async enact() {
    await git("merge", this.name);
  }
}

interface IFullPushOptions {
  remoteName: string;
  force: boolean;
}

export type IPushOptions = Partial<IFullPushOptions>;

export class PushAction extends Action {
  private readonly options: IFullPushOptions;

  constructor(options: IPushOptions = {}) {
    super();

    this.options = {
      remoteName: "origin",
      force: true,
      ...options,
    };
  }

  async enact(context: Context) {
    const args = ["push"];
    if (this.options.force) {
      args.push("--force");
    }
    args.push(this.options.remoteName);
    args.push(`${context.currentBranch}:${context.currentBranch}`);
    await git(...args);
  }
}

export class ActionSequence extends Action {
  private actions: Action[];

  constructor() {
    super();
    this.actions = [];
  }

  add(action: Action) {
    this.actions.push(action);
  }

  async enact(context: Context) {
    for (const each of this.actions) {
      await each.enact(context);
    }
  }
}
