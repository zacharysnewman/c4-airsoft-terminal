import ansiEscapes from "ansi-escapes";
import { randomInt } from "crypto";
import readline from "readline";

const title = "Nuclear Launch Sequence Initiated...\nLaunch Codes Requested...";
const prompt = "Enter Launch Code: ";
const getCurrentLaunchCode = () => randomInt(10000);
let launchCode = getCurrentLaunchCode();
let timeManager;
let progress = 0;
let userInput = "";

class TerminalManager {
  contents: string;
  constructor() {
    this.contents = "";
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

  displayDynamicContent(
    updateInterval: number,
    getContent: { (): string; (): any }
  ) {
    setInterval(() => {
      const newContent = getContent();
      this.update(newContent);
    }, updateInterval);
  }

  listenForRawInput(handleInput) {
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.on("keypress", (char, key) => {
        handleInput(char, key);
        if (key.sequence === "\u0003") {
          // Ctrl+C to exit
          process.exit();
        }
      });
    }
  }
}

const getTimeManager = () => {
  let startTime = Date.now();
  return {
    getElapsedTime: () => {
      const elapsedMs = Date.now() - startTime;
      const seconds = Math.floor(elapsedMs / 1000) % 60;
      const minutes = Math.floor(elapsedMs / (1000 * 60)) % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
      )}`;
    },
    resetStartTime: () => (startTime = Date.now()),
  };
};

// Progress bar function
function getProgressBar(progress: number) {
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

const combineLines = (lines: string[]) => {
  lines.join("\n");
};

function getContents(timeManager) {
  return getContent(
    title,
    timeManager.getElapsedTime(),
    getProgressBar(progress),
    `Current Launch Code is ${launchCode}`,
    prompt
  );
}
function getContent(title, elapsedTime, progressBar, dynamicContent, prompt) {
  return `${title}\nElapsed Time: ${elapsedTime}\n\n${progressBar}\n${dynamicContent}\n${prompt}${userInput}`;
}

function handleRawInput(char, key) {
  if (key.name === "backspace") {
    userInput = userInput.slice(0, -1);
  } else if (key.name === "return") {
    console.log(`Received Launch Code: ${userInput}`);
    userInput = "";
  } else {
    userInput += char;
  }
  terminalManager.update(getContents(timeManager));
}

function main() {
  timeManager = getTimeManager();

  const contents = () => [
    `Nuclear Launch Sequence Initiated...`,
    `Launch Codes Requested...`,
    `Elapsed Time: ${timeManager.getElapsedTime()}`,
    `${getProgressBar(progress)}`,
    `Current Launch Code is ${launchCode}`,
    `${prompt}${userInput}`,
    `Incorrect`,
  ];

  terminalManager.displayDynamicContent(1000, () => getContents(timeManager));
  terminalManager.listenForRawInput(handleRawInput);
}

main();
