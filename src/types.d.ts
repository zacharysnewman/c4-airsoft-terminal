export type CodeResult = "Pending" | "Accepted" | "Rejected";

export interface GameModeParams {
  getTimeManager: () => TimeManager;
  getCurrentProgressToObjective: () => number;
  getUserInput: () => string;
  getAcceptedCodes: () => string[];
  getCurrentCode: () => number;
  getLastCodeResult: () => CodeResult;
}

interface ConditionConfig {
  condition: () => boolean;
  message: () => string;
  audioPath: string;
}
