export type CodeResult = "Pending" | "Accepted" | "Rejected";

export interface GameModeParams {
  getTimeManager: () => TimeManager;
  getCurrentProgressToObjective: () => number;
  getUserInput: () => string;
  getAcceptedCodes: () => string[];
  getCurrentCode: () => number;
  getLastCodeResult: () => CodeResult;
  pregameTimerKey: string;
  overallTimerKey: string;
  ingameTimerKey: string;
}

interface ConditionConfig {
  condition: () => boolean;
  message: () => string;
  audioPath: string;
}
