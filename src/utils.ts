import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function pause(durationMs: number) {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}

const pauseTimeNonNewline = 50; // 500ms for non-newline characters
const pauseTimeNewline = 400; // 1000ms for newline characters

export async function* stringIterator(input: string) {
  let currentString = "";

  for (const char of input) {
    currentString += char;
    yield currentString;

    if (char === "\n") {
      await pause(pauseTimeNewline);
    } else if (!/\s/.test(char)) {
      await pause(pauseTimeNonNewline);
    }
  }
}

export function formatTime(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  // const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

export function displayPrompt(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

export const displayPromptForInput = (prompt: string) => {
  return new Promise<string>((resolve) => {
    rl.question(prompt, (input) => {
      resolve(input);
    });
  });
};

export function waitForCondition(
  conditionFn: () => boolean,
  interval: number = 100
): Promise<void> {
  return new Promise((resolve, reject) => {
    const checkCondition = () => {
      if (conditionFn()) {
        clearInterval(intervalId);
        resolve();
      }
    };

    const intervalId = setInterval(checkCondition, interval);
  });
}
