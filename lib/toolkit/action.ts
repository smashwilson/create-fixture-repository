import {loremIpsum} from "lorem-ipsum";
import fs from "fs-extra";
import path from "path";

import {git} from "./git";
import {log} from "./log";
import {Context} from "./context";
import {FileCreator, FileModifier} from "./files";

abstract class Action {
  abstract enact(context: Context): Promise<void>;
}

interface IFullFileCreateOptions {
  relativePath: string | null;
  autoStage: boolean;
}

export type IFileGenerator = (f: FileCreator) => any;

export type IFileCreateOptions = Partial<IFullFileCreateOptions>;

export class FileCreateAction extends Action {
  private readonly options: IFullFileCreateOptions;
  private readonly generator: IFileGenerator;

  constructor(options: IFileCreateOptions, generator: IFileGenerator) {
    super();
    this.options = {
      relativePath: null,
      autoStage: true,
      ...options,
    };
    this.generator = generator;
  }

  async enact(context: Context) {
    const relativePath = this.options.relativePath || context.fileName();
    if (path.isAbsolute(relativePath)) {
      throw new Error(`Expected relative path but got ${relativePath}`);
    }
    log.debug("Creating file.", {path: relativePath});

    const fullPath = path.resolve(relativePath);

    await fs.mkdirs(path.dirname(fullPath));

    const creator = new FileCreator();
    this.generator(creator);
    await fs.writeFile(fullPath, creator.getContent(), {
      encoding: "utf8",
      flag: "wx",
    });

    if (this.options.autoStage) {
      await git("add", relativePath);
    }
    context.madeChanges = true;
  }
}

interface IFullFileModifyOptions {
  relativePath: string;
  autoStage: boolean;
}

export interface IFileModifyOptions {
  relativePath: string;
  autoStage?: boolean;
}

export type IFileModifier = (f: FileModifier) => any;

export class FileModifyAction extends Action {
  private readonly options: IFullFileModifyOptions;
  private readonly modifier: IFileModifier;

  constructor(options: IFileModifyOptions, modifier: IFileModifier) {
    super();
    this.options = {
      autoStage: true,
      ...options,
    };
    this.modifier = modifier;
  }

  async enact(context: Context) {
    if (path.isAbsolute(this.options.relativePath)) {
      throw new Error(
        `Expected relative path but got ${this.options.relativePath}`
      );
    }
    log.debug("Modifying file.", {path: this.options.relativePath});

    const fullPath = path.resolve(this.options.relativePath);
    const original = await fs.readFile(fullPath, {
      encoding: "utf8",
      flag: "r",
    });
    const modifier = new FileModifier(original);
    this.modifier(modifier);
    await fs.writeFile(fullPath, modifier.getContent(), {
      encoding: "utf8",
      flag: "w",
    });

    if (this.options.autoStage) {
      await git("add", this.options.relativePath);
    }
    context.madeChanges = true;
  }
}

export class BranchAction extends Action {
  constructor(private readonly name: string) {
    super();
  }

  async enact(context: Context) {
    log.debug("Creating a new branch.", {branch: this.name});
    await git("checkout", "-b", this.name);
    context.currentBranch = this.name;
  }
}

export class CheckoutAction extends Action {
  constructor(private readonly name: string) {
    super();
  }

  async enact(context: Context) {
    log.debug("Checking out an existing branch.", {branch: this.name});
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
    log.debug("Making a commit.");

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

  async enact(context: Context) {
    log.debug("Merging in another branch.", {
      base: context.currentBranch,
      head: this.name,
    });
    await git("merge", this.name);
  }
}

interface IFullPushOptions {
  remoteName: string;
  force: boolean;
  setUpstream: boolean;
}

export type IPushOptions = Partial<IFullPushOptions>;

export class PushAction extends Action {
  private readonly options: IFullPushOptions;

  constructor(options: IPushOptions = {}) {
    super();

    this.options = {
      remoteName: "origin",
      force: true,
      setUpstream: true,
      ...options,
    };
  }

  async enact(context: Context) {
    if (!context.remoteURL) {
      log.warn("Skipping push because --remote was not specified.");
      return;
    }

    log.debug("Pushing branch.", {branch: context.currentBranch});

    const args = ["push"];
    if (this.options.force) {
      args.push("--force");
    }
    if (this.options.setUpstream) {
      args.push("--set-upstream");
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
