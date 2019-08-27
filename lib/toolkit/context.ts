export class Context {
  public currentBranch: string;
  public madeChanges: boolean;
  public branchPushed: boolean;

  private counter: number;

  constructor() {
    this.currentBranch = "master";
    this.madeChanges = false;
    this.branchPushed = false;

    this.counter = 0;
  }

  private generateName(prefix: string): string {
    const n = `${prefix}-${this.counter}`;
    this.counter++;
    return n;
  }

  fileName(): string {
    return this.generateName("file");
  }
}
