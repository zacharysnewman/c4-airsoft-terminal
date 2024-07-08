import ansiEscapes from "ansi-escapes";
import { randomInt } from "crypto";
import readline from "readline";

const title = "Nuclear Launch Sequence Initiated";
const prompt = "Enter Launch Code: ";
const getCurrentLaunchCode = () => randomInt(10000);
let progress = 0;

class TerminalManager {
  constructor() {
    this.contents = "";
    this.startTime = Date.now();
  }

  clearTerminal() {
    process.stdout.write(ansiEscapes.clearScreen);
  }

  writeContents(contents) {
    this.contents = contents;
    process.stdout.write(this.contents);
  }

  setCursorToEnd() {
    const lines = this.contents.split("\n");
    process.stdout.write(
      ansiEscapes.cursorTo(lines[lines.length - 1].length, lines.length - 1)
    );
  }

  update(contents) {
    this.clearTerminal();
    this.writeContents(contents);
    this.setCursorToEnd();
  }

  startIntervalUpdate(interval, getContent) {
    setInterval(() => {
      const newContent = getContent();
      this.update(newContent);
    }, interval);
  }

  listenForInput(prompt, handleInput) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on("line", (input) => {
      handleInput(input);
      rl.prompt();
    });

    rl.setPrompt(prompt);
    rl.prompt();
  }

  getElapsedTime() {
    const elapsedMs = Date.now() - this.startTime;
    const seconds = Math.floor(elapsedMs / 1000) % 60;
    const minutes = Math.floor(elapsedMs / (1000 * 60)) % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }
}
const timeManager = {
  startTime: Date.now(),
  getElapsedTime: () => {
    const elapsedMs = Date.now() - this.startTime;
    const seconds = Math.floor(elapsedMs / 1000) % 60;
    const minutes = Math.floor(elapsedMs / (1000 * 60)) % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  },
  resetStartTime: () => (startTime = Date.now()),
};

// Progress bar function
function getProgressBar(progress) {
  const barLength = 30; // Length of the progress bar
  const filledLength = Math.round(progress * barLength);

  const emptyChar = "░";
  const filledChar = "█";

  const filledPart = filledChar.repeat(filledLength);
  const emptyPart = emptyChar.repeat(barLength - filledLength);

  const percentage = (progress * 100).toFixed(2);

  return `[${filledPart}${emptyPart}] ${percentage}%`;
}

// Example usage
const terminalManager = new TerminalManager();

function getContent(title, elapsedTime, progressBar, dynamicContent, prompt) {
  return `${title}\nElapsed Time: ${elapsedTime}\n\n${progressBar}\n${dynamicContent}\n${prompt}`;
}

function handleInput(input) {
  if (input.trim().toLowerCase() === "stop") {
    console.log("Stopping interval update.");
    process.exit(0);
  }
  console.log(`Received Launch Code: ${input}`);
}

function main() {
  let launchCode = getCurrentLaunchCode();
  terminalManager.startIntervalUpdate(100, () =>
    getContent(
      title,
      terminalManager.getElapsedTime(),
      getProgressBar(progress),
      `Current Launch Code is ${launchCode}`,
      prompt
    )
  );
  terminalManager.listenForInput("", handleInput);
}
main();
