import { randomInt } from "crypto";
import {
  displayPrompt,
  displayPromptForInput,
  pause,
  waitForCondition,
} from "./src/utils.js";
import { TerminalManager } from "./src/TerminalManager.js";
import { TimeManager } from "./src/TimeManager.js";
import { GameModeConfig, getGamemodes } from "./src/gamemodes.js";
import { CodeResult, GameModeParams } from "./src/types.js";
import AudioPlayer from "./src/AudioPlayer.js";

// Press "enter" this # times to access gamemode selection (after finishing a game)
const pressToShowGamemodeSelectCount = 10;

const terminalManager = new TerminalManager();
const timeManager = new TimeManager();
const getCurrentCode = () => randomInt(10000); // TODO: Should be implemented separately and configured in gamemodes
let currentCode: number;
let acceptedCodes: string[];
let lastCodeResult: CodeResult;
let currentProgressToObjective: number;
let userInput: string;

const gamemodeParams: GameModeParams = {
  getTimeManager: () => timeManager,
  getCurrentProgressToObjective: () => currentProgressToObjective,
  getUserInput: () => userInput,
  getAcceptedCodes: () => acceptedCodes,
  getCurrentCode: () => currentCode,
  getLastCodeResult: () => lastCodeResult,
};

const handleRawInput =
  (gamemode: GameModeConfig) => (char: string, key: { name: string }) => {
    if (key.name === "backspace") {
      userInput = userInput.slice(0, -1);
    } else if (key.name === "return") {
      if (userInput === currentCode.toString()) {
        submitInput(userInput);
      } else {
        rejectInput(userInput);
      }
      userInput = "";
    } else {
      userInput += char;
    }
    const newContent = gamemode.display();
    terminalManager.update(newContent);
  };

const submitInput = (input: string) => {
  currentProgressToObjective += 0.5; // TODO: HARCODING WARNING (should be configured in gamemode)
  acceptedCodes.push(input);
  lastCodeResult = "Accepted";
  currentCode = getCurrentCode();
};

const rejectInput = (input: string) => {
  lastCodeResult = "Rejected";
};

const resetGameState = () => {
  currentCode = getCurrentCode();
  acceptedCodes = [];
  lastCodeResult = "Pending";
  currentProgressToObjective = 0;
  userInput = "";
};

async function runGamemode(gamemode: GameModeConfig) {
  terminalManager.clearTerminal();
  await displayPrompt(gamemode.start.message());

  terminalManager.clearTerminal();
  timeManager.resetStartTime(gamemode.timeLimitMinutes);

  /* \/ Disable to speed up testing \/ */
  const activelyTypingDisplay = terminalManager.type(gamemode.display());
  await pause(1000);
  AudioPlayer.play(gamemode.start.audioPath);
  await activelyTypingDisplay;
  /* /\ Disable to speed up testing /\ */

  timeManager.resetStartTime(gamemode.timeLimitMinutes);

  const displayIntervalId = terminalManager.displayDynamicContent(
    100,
    gamemode.display
  );
  terminalManager.listenForRawInput(handleRawInput(gamemode));

  await waitForCondition(
    () =>
      gamemode.team1Win.condition() ||
      gamemode.team2Win.condition() ||
      gamemode.tie.condition()
  );

  terminalManager.stopListeningForRawInput();
  clearInterval(displayIntervalId);

  let winCondition = undefined;
  if (gamemode.team1Win.condition()) {
    winCondition = gamemode.team1Win;
  } else if (gamemode.team2Win.condition()) {
    winCondition = gamemode.team2Win;
  } else {
    winCondition = gamemode.tie;
  }
  const activelyTypingWinMessage = terminalManager.type(winCondition.message());
  await pause(1000);
  AudioPlayer.play(winCondition.audioPath);
  await activelyTypingWinMessage;

  for (let i = 0; i < pressToShowGamemodeSelectCount; i++) {
    await displayPrompt("");
  }
}

async function selectGamemode() {
  const gamemodes = getGamemodes(gamemodeParams);
  let isValidInput = false;
  let selectedId: number = -1;

  const promptGamemodeSelection = async () => {
    const quitOption = `${gamemodes.length}) Quit`;
    return displayPromptForInput(
      [
        "Select Gamemode",
        ...gamemodes.map((x, i) => `${i}) ${x.gameModeName}`),
        quitOption,
        "\nEnter option #: ",
      ].join("\n")
    );
  };

  while (!isValidInput) {
    const input = await promptGamemodeSelection();
    selectedId = parseInt(input);

    if (
      !isNaN(selectedId) &&
      selectedId >= 0 &&
      selectedId < gamemodes.length
    ) {
      isValidInput = true;
    } else if (selectedId === gamemodes.length) {
      return false;
    } else {
      console.log("Invalid input. Please enter a valid gamemode id.\n\n");
    }
  }

  const gamemode = gamemodes[selectedId];
  resetGameState();
  await runGamemode(gamemode);
  return true;
}

async function main() {
  let keepRunning = true;
  while (keepRunning) {
    keepRunning = await selectGamemode();
  }
}

main().then(() => {
  process.stdin.pause();
});
