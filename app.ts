import {
  displayPrompt,
  displayPromptForInput,
  pause,
  waitForCondition,
} from "./src/utils.js";
import { TerminalManager } from "./src/TerminalManager.js";
import { TimeManager } from "./src/TimeManager.js";
import { dynamicDisplayRefreshRateMs, getGamemodes } from "./src/gamemodes.js";
import {
  CodeResult,
  GameModeParams,
  MessageWithAudio,
  GameModeConfig,
} from "./src/types.js";
import AudioPlayer from "./src/AudioPlayer.js";

// Press "enter" this # times to access gamemode selection (after finishing a game)
const pressToShowGamemodeSelectCount = 10;

const pregameTimerKey = "pregame";
const overallTimerKey = "overall";
const objectiveTimerKey = "ingame";
const terminalManager = new TerminalManager(dynamicDisplayRefreshRateMs);
const timeManager = new TimeManager();
let positiveCode: string;
let negativeCode: string;
let acceptedPositiveCodes: string[];
let acceptedNegativeCodes: string[];
let lastCodeResult: CodeResult;
let currentProgressToObjective: number;
let userInput: string;

const gamemodeParams: GameModeParams = {
  getTimeManager: () => timeManager,
  getCurrentProgressToObjective: () => currentProgressToObjective,
  getUserInput: () => userInput,
  getAcceptedPositiveCodes: () => acceptedPositiveCodes,
  getAcceptedNegativeCodes: () => acceptedNegativeCodes,
  getPositiveCode: () => positiveCode,
  getNegativeCode: () => negativeCode,
  getLastCodeResult: () => lastCodeResult,
  pregameTimerKey,
  overallTimerKey,
  objectiveTimerKey,
};

const handleRawInput =
  (gamemode: GameModeConfig) => (char: string, key: { name: string }) => {
    if (key.name === "backspace") {
      userInput = userInput.slice(0, -1);
    } else if (key.name === "return") {
      if (userInput === positiveCode.toString()) {
        submitInput(userInput, gamemode, true);
      } else if (userInput === negativeCode.toString()) {
        submitInput(userInput, gamemode, false);
      } else {
        rejectInput(userInput);
      }
      userInput = "";
    } else {
      userInput += char.toUpperCase();
    }
    const newContent = gamemode.objectiveDisplayMessage();
    terminalManager.update(newContent);
  };

const submitInput = (
  input: string,
  gamemode: GameModeConfig,
  isPositive: boolean
) => {
  const progressChange = 1 / gamemode.codeCount;
  if (isPositive) {
    acceptedPositiveCodes.push(input);
    currentProgressToObjective += progressChange;
    currentProgressToObjective = parseFloat(
      currentProgressToObjective.toFixed(1)
    );
    positiveCode = gamemode.generatePositiveCode();
  } else {
    acceptedNegativeCodes.push(input);
    currentProgressToObjective -= progressChange;
    currentProgressToObjective = parseFloat(
      currentProgressToObjective.toFixed(1)
    );
    negativeCode = gamemode.generateNegativeCode();
  }
  lastCodeResult = "Accepted";
};

const rejectInput = (input: string) => {
  lastCodeResult = "Rejected";
};

const resetGameState = (gamemode: GameModeConfig) => {
  positiveCode = gamemode.generatePositiveCode();
  negativeCode = gamemode.generateNegativeCode();
  acceptedPositiveCodes = [];
  acceptedNegativeCodes = [];
  lastCodeResult = "Pending";
  currentProgressToObjective = gamemode.objectiveStartProgress;
  userInput = "";
};

async function runGamemode(gamemode: GameModeConfig) {
  // Pregame
  timeManager.setTimer(pregameTimerKey, gamemode.pregameTimeLimitSeconds);
  const displayPregameTimerIntervalId = terminalManager.displayDynamicContent(
    gamemode.pregameTimerMessage
  );
  timeManager.startTimer(pregameTimerKey);

  await waitForCondition(() => timeManager.isTimerEnded(pregameTimerKey));

  clearInterval(displayPregameTimerIntervalId);
  // terminalManager.clearTerminal();

  // Game Started
  timeManager.setTimer(overallTimerKey, gamemode.overallTimeLimitSeconds);
  await terminalManager.type(gamemode.start.message);
  timeManager.startTimer(overallTimerKey);
  let startObjective = false;
  const startObjectivePromptIntervalId = terminalManager.displayDynamicContent(
    gamemode.start.message
  );
  terminalManager.listenForRawInput(() => (startObjective = true));
  await waitForCondition(() => startObjective);

  terminalManager.stopListeningForRawInput();
  clearInterval(startObjectivePromptIntervalId);
  // terminalManager.clearTerminal();

  const typingObjectiveDisplay = terminalManager.type(
    gamemode.objectiveDisplayMessage,
    1
  );
  await pause(1000);
  AudioPlayer.play(gamemode.start.audioPath);
  await typingObjectiveDisplay;

  // Objective Phase
  const displayIntervalId = terminalManager.displayDynamicContent(
    gamemode.objectiveDisplayMessage
  );
  terminalManager.listenForRawInput(handleRawInput(gamemode));

  let winMessage: MessageWithAudio = undefined as unknown as MessageWithAudio;
  await waitForCondition(() => {
    const overallTimerEnded = timeManager.isTimerEnded(overallTimerKey);
    const objectiveTimerEnded = timeManager.isTimerEnded(objectiveTimerKey);
    const objectiveReachedMin = currentProgressToObjective <= 0;
    const objectiveReachedMax = currentProgressToObjective >= 1;

    if (overallTimerEnded && !!gamemode.overallTimerEnds) {
      winMessage = gamemode.overallTimerEnds;
    } else if (objectiveTimerEnded && !!gamemode.objectiveTimerEnds) {
      winMessage = gamemode.objectiveTimerEnds;
    } else if (objectiveReachedMin && !!gamemode.objectiveReachesMin) {
      winMessage = gamemode.objectiveReachesMin;
    } else if (objectiveReachedMax && !!gamemode.objectiveReachesMax) {
      winMessage = gamemode.objectiveReachesMax;
    }

    return !!winMessage;
  });

  terminalManager.stopListeningForRawInput();
  clearInterval(displayIntervalId);
  timeManager.stopTimer(overallTimerKey);
  timeManager.stopTimer(objectiveTimerKey);

  // Game End
  const activelyTypingWinMessage = terminalManager.type(winMessage.message);
  await pause(1000);
  AudioPlayer.play(winMessage.audioPath);
  await activelyTypingWinMessage;

  for (let i = 0; i < pressToShowGamemodeSelectCount; i++) {
    await terminalManager.clearTerminal();
    await displayPrompt(winMessage.message());
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
  resetGameState(gamemode);
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
