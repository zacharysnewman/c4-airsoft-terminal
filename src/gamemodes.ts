import { getProgressBar } from "./progressBar.js";
import { ConditionConfig, GameModeParams } from "./types.js";

export const dynamicDisplayRefreshRateMs = 100;

export interface GameModeConfig {
  gameModeName: string;
  pregameTimeLimitSeconds: number;
  overallTimeLimitSeconds: number;
  objectiveTimeLimitSeconds: number;
  display: () => string;
  start: ConditionConfig;
  team1Win: ConditionConfig;
  team2Win: ConditionConfig;
  tie: ConditionConfig;
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
    start: {
      condition: () => false,
      message: () => "Initiate Nuclear ICBM Launch Sequence? ",
      audioPath: "audio/StartLaunch.mp3",
    },
    display: () =>
      [
        `Nuclear ICBM launch sequence initiated...`,
        `Target acquired: Washington state`,
        `Launch codes requested...`,
        `Time remaining: ${getTimeManager().getTimeRemainingFormatted(
          overallTimerKey
        )}`,
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
          "",
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
          "",
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
