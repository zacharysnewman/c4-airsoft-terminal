import { getProgressBar } from "./progressBar.js";
import { ConditionConfig, GameModeParams } from "./types.js";
import { generateRandomCode } from "./utils.js";

export const dynamicDisplayRefreshRateMs = 500;

export interface GameModeConfig {
  gameModeName: string;
  pregameTimeLimitSeconds: number;
  overallTimeLimitSeconds: number;
  objectiveTimeLimitSeconds: number;
  objectiveStartProgress: number;
  codeCount: number;
  generatePositiveCode: () => string;
  generateNegativeCode: () => string;
  pregameTimerMessage: () => string;
  start: ConditionConfig;
  objectiveDisplayMessage: () => string;
  team1Win: ConditionConfig;
  team2Win: ConditionConfig;
  tie: ConditionConfig;
  // conditionalAudio[]
}

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
  objectiveTimerKey: ingameTimerKey,
}: GameModeParams): GameModeConfig[] => [
  {
    gameModeName: "Nuclear Launch Sequence",
    pregameTimeLimitSeconds: 0,
    overallTimeLimitSeconds: 20 * 60,
    objectiveTimeLimitSeconds: 0,
    objectiveStartProgress: 0.5,
    codeCount: 10,
    generatePositiveCode: generateRandomCode(
      4,
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    ),
    generateNegativeCode: () => "!@#$|",
    pregameTimerMessage: () =>
      `Pregame Timer: ${getTimeManager().getTimeRemainingFormatted(
        pregameTimerKey
      )}`,
    start: {
      condition: () => false,
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
    team1Win: {
      condition: () => getCurrentProgressToObjective() >= 1,
      message: () =>
        [
          "Launch codes accepted...",
          "Nuclear ICBM launched...",
          "Goodbye Washington and good luck...",
          "Attackers win!",
          `Elapsed time: ${getTimeManager().getElapsedTimeFormatted(
            overallTimerKey
          )}`,
          `Time remaining: ${getTimeManager().getTimeRemainingFormatted(
            overallTimerKey
          )}`,
          "\n",
        ].join("\n"),
      audioPath: "audio/SuccessLaunch.mp3",
    },
    team2Win: {
      condition: () => getTimeManager().isTimerEnded(overallTimerKey),
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
    tie: {
      condition: () => false,
      message: () => "",
      audioPath: "",
    },
  },
  { gameModeName: "SnD" } as GameModeConfig,
  { gameModeName: "Tug of War" } as GameModeConfig,
];
