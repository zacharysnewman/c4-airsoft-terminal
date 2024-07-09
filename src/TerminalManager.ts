import ansiEscapes from "ansi-escapes";
import readline from "readline";
import { stringIterator } from "./utils.js";

export class TerminalManager {
  private lineCount: number;
  private lastLineLength: number;
  private keypressListener:
    | ((char: string, key: { name: string; sequence: string }) => void)
    | null = null;

  constructor() {
    this.lineCount = 0;
    this.lastLineLength = 0;
  }

  clearTerminal() {
    process.stdout.write(ansiEscapes.clearScreen);
  }

  writeContents(contents: string) {
    const lines = contents.split("\n");
    this.lineCount = lines.length - 1;
    this.lastLineLength = lines[lines.length - 1]?.length ?? 0;
    process.stdout.write(contents);
  }

  setCursorToEnd() {
    process.stdout.write(
      ansiEscapes.cursorTo(this.lastLineLength, this.lineCount)
    );
  }

  update(contents: string) {
    this.clearTerminal();
    this.writeContents(contents);
    this.setCursorToEnd();
  }

  async type(input: string) {
    for await (const partialString of stringIterator(input)) {
      this.update(partialString);
    }
  }

  displayDynamicContent(updateInterval: number, getOutput: () => string) {
    const intervalId = setInterval(() => {
      const newContent = getOutput();
      this.update(newContent);
    }, updateInterval);
    return intervalId;
  }

  listenForRawInput(
    handleInput: (char: string, key: { name: string }) => void
  ) {
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      this.keypressListener = (char, key) => {
        handleInput(char, key);
        if (key.sequence === "\u0003") {
          // Ctrl+C to exit
          process.exit();
        }
      };
      process.stdin.on("keypress", this.keypressListener);
    }
  }

  stopListeningForRawInput() {
    if (this.keypressListener) {
      process.stdin.removeListener("keypress", this.keypressListener);
      this.keypressListener = null;
    }
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
  }
}
