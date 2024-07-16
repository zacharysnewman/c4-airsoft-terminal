import { getProgressBar } from "./progressBar.js";
import { GameModeConfig, GameModeParams } from "./types.js";
import { generateRandomCode } from "./utils.js";

export const dynamicDisplayRefreshRateMs = 500;

const unguessable = "!@#$|";
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const alphanumeric = letters + numbers;
const binary = "01";

// Gamemode specific timers
// Customizing codes and code progress %
// Audio conditions
export const getGamemodes = ({
  getTimeManager,
  getCurrentProgressToObjective,
  getUserInput,
  getAcceptedPositiveCodes,
  getPositiveCode,
  getNegativeCode,
  getLastCodeResult,
  pregameTimerKey,
  overallTimerKey,
  objectiveTimerKey,
}: GameModeParams): GameModeConfig[] => [
  {
    gameModeName: "Nuclear Launch Sequence",
    pregameTimeLimitSeconds: 10,
    overallTimeLimitSeconds: 20 * 60,
    objectiveTimeLimitSeconds: 0,
    objectiveStartProgress: 0,
    codeCount: 10,
    generatePositiveCode: generateRandomCode(4, alphanumeric),
    generateNegativeCode: () => unguessable,
    pregameTimerMessage: () =>
      `Pregame Timer: ${getTimeManager().getTimeRemainingFormatted(
        pregameTimerKey
      )}`,
    start: {
      message: () =>
        [
          `Time remaining: ${getTimeManager().getTimeRemainingFormatted(
            overallTimerKey
          )}`,
          "Initiate Nuclear ICBM Launch Sequence? ",
        ].join("\n"),
      audioPath: "audio/StartLaunch.mp3",
    },
    objectiveDisplayMessage: () =>
      [
        `Time remaining: ${getTimeManager().getTimeRemainingFormatted(
          overallTimerKey
        )}`,
        `Nuclear ICBM launch sequence initiated...`,
        `Target acquired: Washington state`,
        `Launch codes requested...`,
        ``,
        `Accepted codes: ${getAcceptedPositiveCodes().join(", ")}`,
        `Sequence: ${getProgressBar(getCurrentProgressToObjective())}`,
        `Current launch code is ${getPositiveCode()}`,
        `(${getLastCodeResult()}) Enter launch code: ${getUserInput()}`,
      ].join("\n"),
    overallTimerEnds: {
      message: () =>
        [
          "Time expired...",
          "Launch sequence terminated...",
          "Washington thanks you...",
          "Defenders win!",
          "\n",
        ].join("\n"),
      audioPath: "audio/FailureLaunch.mp3",
    },
    objectiveTimerEnds: undefined,
    objectiveReachesMin: undefined,
    objectiveReachesMax: {
      message: () =>
        [
          "Launch codes accepted...",
          "Nuclear ICBM launched...",
          "Goodbye Washington and good luck...",
          "Attackers win!",
          "\n",
        ].join("\n"),
      audioPath: "audio/SuccessLaunch.mp3",
    },
  },
  // {
  //   gameModeName: "Search and Destroy",
  //   pregameTimeLimitSeconds: 0,
  //   overallTimeLimitSeconds: 5 * 60,
  //   objectiveTimeLimitSeconds: 0,
  //   objectiveStartProgress: 0,
  //   codeCount: 5,
  //   generatePositiveCode: generateRandomCode(2, binary),
  //   generateNegativeCode: generateRandomCode(2, letters),
  //   pregameTimerMessage: () =>
  //     `Pregame Timer: ${getTimeManager().getTimeRemainingFormatted(
  //       pregameTimerKey
  //     )}`,
  //   start: {
  //     message: () =>
  //       [
  //         `Time remaining: ${getTimeManager().getTimeRemainingFormatted(
  //           overallTimerKey
  //         )}`,
  //         "Would you like to arm the bomb? ",
  //       ].join("\n"),
  //     audioPath: "audio/StartLaunch.mp3",
  //   },
  //   objectiveDisplayMessage: () =>
  //     [
  //       `Time remaining: ${getTimeManager().getTimeRemainingFormatted(
  //         overallTimerKey
  //       )}`,
  //       `Launching bomb arming app...`,
  //       `Administrator permissions required...`,
  //       `Bomb arming codes requested...`,
  //       ``,
  //       `Arming: ${getProgressBar(getCurrentProgressToObjective())}`,
  //       `Current arming code is ${getPositiveCode()}`,
  //       `(${getLastCodeResult()}) Enter arming code: ${getUserInput()}`,
  //     ].join("\n"),
  //   overallTimerEnds: {
  //     message: () =>
  //       [
  //         "Time expired...",
  //         "Launch sequence terminated...",
  //         "Washington thanks you...",
  //         "Defenders win!",
  //         "\n",
  //       ].join("\n"),
  //     audioPath: "audio/FailureLaunch.mp3",
  //   },
  //   objectiveTimerEnds: {
  //     message: () =>
  //       [
  //         "Bomb detonated!",
  //         "Congratulations, you blew everyone up...",
  //         "...including yourself.",
  //         "Attackers win!",
  //         "\n",
  //       ].join("\n"),
  //     audioPath: "audio/SuccessLaunch.mp3",
  //   },
  // },
  {
    gameModeName: "Uplink",
    pregameTimeLimitSeconds: 0,
    overallTimeLimitSeconds: 5 * 60,
    objectiveTimeLimitSeconds: 0,
    objectiveStartProgress: 0,
    codeCount: 5,
    generatePositiveCode: generateRandomCode(2, binary),
    generateNegativeCode: generateRandomCode(2, letters),
    pregameTimerMessage: () =>
      `Pregame Timer: ${getTimeManager().getTimeRemainingFormatted(
        pregameTimerKey
      )}`,
    start: {
      message: () =>
        [
          `Time remaining: ${getTimeManager().getTimeRemainingFormatted(
            overallTimerKey
          )}`,
          "Would you like to start the Uplink? ",
        ].join("\n"),
      audioPath: "audio/StartLaunch.mp3",
    },
    objectiveDisplayMessage: () => [""].join("\n"),
    overallTimerEnds: {
      message: () =>
        [
          `Time remaining: ${getTimeManager().getTimeRemainingFormatted(
            overallTimerKey
          )}`,
          ``,
        ].join("\n"),
      audioPath: "",
    },
    objectiveReachesMin: {
      message: () => [""].join("\n"),
      audioPath: "",
    },
    objectiveReachesMax: {
      message: () => [""].join("\n"),
      audioPath: "",
    },
  },
];
