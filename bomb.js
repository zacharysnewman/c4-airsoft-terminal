import ansiEscapes from "ansi-escapes";
import readline from "readline";

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
    const lines = this.contents.split("\n").length;
    process.stdout.write(ansiEscapes.cursorTo(0, lines - 1));
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

let progress = 0;
function getContent() {
  const progressBar = getProgressBar(progress);
  const elapsedTime = terminalManager.getElapsedTime();
  progress += 0.01;
  if (progress > 1) progress = 0;

  return `Nuclear Launch Initiated\nElapsed Time: ${elapsedTime}\n\n${progressBar}\nCurrent Launch Code: XBYY\nEnter Launch Codes: `;
}

function handleInput(input) {
  if (input.trim().toLowerCase() === "stop") {
    console.log("Stopping interval update.");
    process.exit(0);
  }
  console.log(`Received Launch Code: ${input}`);
}

terminalManager.startIntervalUpdate(100, getContent);
terminalManager.listenForInput("Enter Launch Codes: ", handleInput);
