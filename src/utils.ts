import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function pause(durationMs: number) {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}

const pauseTimeNonNewlineMs = 50;
const pauseTimeNewlineMs = 400;

export async function* stringIterator(
  inputFn: () => string,
  skipLines: number = 0
) {
  let currentString = "";
  let lineCount = 0;

  for (let i = 0; i < inputFn().length; i++) {
    const inputString = inputFn();
    const char = inputString[i];

    // If we haven't reached the desired line to start yielding, just skip processing
    if (char === "\n") {
      lineCount++;
    }

    // Start yielding only after skipping the specified number of lines
    if (lineCount >= skipLines) {
      currentString = inputString.slice(0, i + 1);
      yield currentString;

      // Pause based on the character type
      if (char === "\n") {
        await pause(pauseTimeNewlineMs);
      } else if (!/\s/.test(char)) {
        await pause(pauseTimeNonNewlineMs);
      }
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

export const generateRandomString = (length: number, characters: string) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const generateRandomCode =
  (length: number, characters: string) => () => {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

export const getPercentage = (progress: number) =>
  `${(progress * 100).toFixed(2)}%`;
