import { getProgressBar } from "./progressBar.js";
import { ConditionConfig, GameModeParams } from "./types.js";

export const dynamicDisplayRefreshRateMs = 500;

export interface GameModeConfig {
  gameModeName: string;
  pregameTimeLimitSeconds: number;
  overallTimeLimitSeconds: number;
  objectiveTimeLimitSeconds: number;
  pregameTimerMessage: () => string;
  start: ConditionConfig;
  display: () => string;
  team1Win: ConditionConfig;
  team2Win: ConditionConfig;
  tie: ConditionConfig;
  // conditionalAudio[]
  // codeCount
  // codeCharacters
}

// Pre game timer
// Overall game timer
// Gamemode specific timers
// Customizing codes and code progress %
// Audio conditions
export const getGamemodes = ({
  getTimeManager,
  getCurrentProgressToObjective,
  getUserInput,
  getAcceptedCodes,
  getCurrentCode,
  getLastCodeResult,
  pregameTimerKey,
  overallTimerKey,
  ingameTimerKey,
}: GameModeParams): GameModeConfig[] => [
  {
    gameModeName: "Nuclear Launch Sequence",
    pregameTimeLimitSeconds: 0,
    overallTimeLimitSeconds: 20 * 60,
    objectiveTimeLimitSeconds: 2 * 60,
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
    display: () =>
      [
        `Time remaining: ${getTimeManager().getTimeRemainingFormatted(
          overallTimerKey
        )}`,
        `Nuclear ICBM launch sequence initiated...`,
        `Target acquired: Washington state`,
        `Launch codes requested...`,
        ``,
        `Accepted codes: ${getAcceptedCodes().join(", ")}`,
        `${getProgressBar(getCurrentProgressToObjective())}`,
        `Current launch code is ${getCurrentCode()}`,
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
