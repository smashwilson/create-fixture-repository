import {loremIpsum} from "lorem-ipsum";

export class FileCreator {
  private content: string;

  constructor() {
    this.content = "";
  }

  line(content: string) {
    this.content += content;
    this.content += "\n";
  }

  lines(count: number) {
    for (let i = 0; i < count; i++) {
      this.line(loremIpsum({count: 1, units: "sentence"}));
    }
  }

  getContent(): string {
    return this.content;
  }
}

export class FileModifier {
  private lines: string[];

  constructor(original: string) {
    this.lines = original.split(/\n/);
  }

  line(index: number, replacement?: string) {
    this.lines[index] =
      replacement || loremIpsum({count: 1, units: "sentence"});
  }

  getContent(): string {
    return this.lines.join("\n");
  }
}
