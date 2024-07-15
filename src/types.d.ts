export type CodeResult = "Pending" | "Accepted" | "Rejected";

export interface GameModeParams {
  getTimeManager: () => TimeManager;
  getCurrentProgressToObjective: () => number;
  getUserInput: () => string;
  getAcceptedPositiveCodes: () => string[];
  getAcceptedNegativeCodes: () => string[];
  getPositiveCode: () => string;
  getNegativeCode: () => string;
  getLastCodeResult: () => CodeResult;
  pregameTimerKey: string;
  overallTimerKey: string;
  objectiveTimerKey: string;
}

interface ConditionConfig {
  condition: () => boolean;
  message: () => string;
  audioPath: string;
}
