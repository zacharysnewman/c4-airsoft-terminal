import { getProgressBar } from "./progressBar.js";
import { ConditionConfig, GameModeParams } from "./types.js";

export interface GameModeConfig {
  gameModeName: string;
  timeLimitMinutes: number;
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
}: GameModeParams): GameModeConfig[] => [
  {
    gameModeName: "Nuclear Launch Sequence",
    timeLimitMinutes: 10,
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
        `Time remaining: ${getTimeManager().getTimeRemainingFormatted()}`,
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
      condition: () => getTimeManager().getTimeRemaining() <= 0,
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
  {
    gameModeName: "Search and Destroy",
    timeLimitMinutes: 10,
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
        `Time remaining: ${getTimeManager().getTimeRemainingFormatted()}`,
        ``,
        `Accepted codes: ${getAcceptedCodes().join(", ")}`,
        `${getProgressBar(getCurrentProgressToObjective())}`,
        `Current launch code is ${getCurrentCode()}`,
        `(${getLastCodeResult()}) Enter launch code: ${getUserInput()}`,
      ].join("\n"),
    team1Win: {
      condition: () => getCurrentProgressToObjective() >= 1,
      message: () => "",
      audioPath: "audio/SuccessLaunch.mp3",
    },
    team2Win: {
      condition: () => getTimeManager().getTimeRemaining() <= 0,
      message: () => "",
      audioPath: "audio/FailureLaunch.mp3",
    },
    tie: {
      condition: () => false,
      message: () => "",
      audioPath: "",
    },
  },
  { gameModeName: "Tug of War" } as GameModeConfig,
];
