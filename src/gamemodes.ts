import { getProgressBar } from "./progressBar.js";
import { GameModeConfig, GameModeParams } from "./types.js";
import { generateRandomCode, getPercentage } from "./utils.js";

export const dynamicDisplayRefreshRateMs = 100;

const unguessable = "!@#$|";
const letters = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
const numbers = "0123456789";
const alphanumeric = letters + numbers;
const binary = "01";

// Audio conditions
export const getGamemodes = ({
  getTimeManager,
  getCurrentProgressToObjective,
  getUserInput,
  getAcceptedPositiveCodes,
  getAcceptedNegativeCodes,
  getPositiveCode,
  getNegativeCode,
  getLastCodeResult,
  pregameTimerKey,
  overallTimerKey,
  objectiveTimerKey,
}: GameModeParams): GameModeConfig[] => [
  {
    gameModeName: "Nuclear Launch Sequence",
    pregameTimeLimitSeconds: 120,
    overallTimeLimitSeconds: 1 * 900,
    objectiveTimeLimitSeconds: 0,
    objectiveStartProgress: 0,
    codeCount: 25,
    generatePositiveCode: generateRandomCode(4, alphanumeric),
    generateNegativeCode: () => unguessable,
    pregameTimerMessage: () =>
      `Pregame Timer: ${getTimeManager().getTimeRemainingFormatted(
        pregameTimerKey
      )}`,
    start: {
      message: () =>
        [
          `Time Remaining: ${getTimeManager().getTimeRemainingFormatted(
            overallTimerKey
          )}`,
          "Initiate Nuclear ICBM Launch Sequence?",
        ].join("\n"),
      audioPath: "audio/StartLaunch.mp3",
    },
    objectivePhases: [
      {
        message: () =>
          [
            `Time Remaining: ${getTimeManager().getTimeRemainingFormatted(
              overallTimerKey
            )}`,
            `Nuclear ICBM Launch Sequence Initiated...`,
            `Acquiring Target...`,
            `Target Location Acquired: Washington State`,
            `Coordinates: 46.917963 -122.295920`,
            ``,
            `Codes Required.`,
            `Full Launch Code: ${getAcceptedPositiveCodes().join(", ")}`,
            ``,
            `Launch Progress: ${getProgressBar(
              getCurrentProgressToObjective()
            )} ${getPercentage(getCurrentProgressToObjective())}`,
            ``,
            `Partial Launch Code: ${getPositiveCode()}`,
            `Enter Partial Launch Code: ${getUserInput()}`,
            `                (${getLastCodeResult()}) `,
          ].join("\n"),
        overallTimerEnds: {
          message: () =>
            [
              "Time To Launch Has Expired...",
              "Launch Sequence Terminated...",
              "Washington Thanks You For Your Valor...",
              ``,
              "Defenders WIN!",
              "\n",
            ].join("\n"),
          audioPath: "audio/FailureLaunch.mp3",
        },
        objectiveTimerEnds: undefined,
        objectiveReachesMin: undefined,
        objectiveReachesMax: {
          message: () =>
            [
              "Launch Codes Accepted...",
              "Nuclear ICBM Has Launched...",
              "ETA To Your Location: 2 Minutes 57 Seconds",
              "Goodbye. Your Sacrifice Will Be Remembered...",
              "Attackers WIN!",
              "\n",
            ].join("\n"),
          audioPath: "audio/SuccessLaunch.mp3",
        },
      },
    ],
  },
  {
    gameModeName: "Search and Destroy",
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
          "Would you like to arm the bomb? ",
        ].join("\n"),
      audioPath: "audio/StartLaunch.mp3",
    },
    objectivePhases: [
      {
        message: () =>
          [
            `Time remaining: ${getTimeManager().getTimeRemainingFormatted(
              overallTimerKey
            )}`,
            `Launching bomb arming app...`,
            `Administrator permissions required...`,
            `Bomb arming codes requested...`,
            ``,
            `Arming: ${getProgressBar(getCurrentProgressToObjective())}`,
            `Current arming code is ${getPositiveCode()}`,
            `(${getLastCodeResult()}) Enter arming code: ${getUserInput()}`,
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
        objectiveTimerEnds: {
          message: () =>
            [
              "Bomb detonated!",
              "Congratulations, you blew everyone up...",
              "...including yourself.",
              "Attackers win!",
              "\n",
            ].join("\n"),
          audioPath: "audio/SuccessLaunch.mp3",
        },
      },
    ],
  },
  {
    gameModeName: "Uplink",
    pregameTimeLimitSeconds: 0,
    overallTimeLimitSeconds: 1 * 600,
    objectiveTimeLimitSeconds: 0,
    objectiveStartProgress: 0.5,
    codeCount: 60,
    generatePositiveCode: generateRandomCode(8, binary),
    generateNegativeCode: generateRandomCode(8, letters),
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
          "Initiate uplink? ",
        ].join("\n"),
      audioPath: "audio/StartLaunch.mp3",
    },
    objectivePhases: [
      {
        message: () =>
          [
            `Time remaining: ${getTimeManager().getTimeRemainingFormatted(
              overallTimerKey
            )}`,
            `HACKER codes entered: ${getAcceptedPositiveCodes().length}`,
            `SECURITY codes entered: ${getAcceptedNegativeCodes().length}`,
            ``,
            `Uplink: ${getProgressBar(
              getCurrentProgressToObjective()
            )} ${getPercentage(getCurrentProgressToObjective())}`,
            ``,
            `Current HACKER uplink code is ${getPositiveCode()}`,
            `Current SECURITY uplink code is ${getNegativeCode()}`,
            ``,
            `(${getLastCodeResult()}) Enter YOUR uplink code: ${getUserInput()}`,
          ].join("\n"),
        overallTimerEnds: {
          message: () => ["Hack Failed!", "Security Team WINS!"].join("\n"),
          audioPath: "",
        },
        objectiveReachesMin: {
          message: () => ["Hack Terminated!", "Security Team WINS!"].join("\n"),
          audioPath: "",
        },
        objectiveReachesMax: {
          message: () => ["Hack Successful!", "Hackers WIN!"].join("\n"),
          audioPath: "",
        },
      },
    ],
  },
];
