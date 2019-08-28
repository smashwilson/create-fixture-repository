import {ActionSequence} from "./action";
import {Context} from "./context";
import {git} from "./git";
import {log} from "./log";

export class Fixture {
  constructor(private readonly actions: ActionSequence) {
    //
  }

  async play() {
    const context = new Context();
    await this.actions.enact(context);
    await this.report();
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
