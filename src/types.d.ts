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

interface MessageWithAudio {
  message: () => string;
  audioPath: string;
}

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
  start: MessageWithAudio;
  objectiveDisplayMessage: () => string;
  overallTimerEnds: MessageWithAudio;
  objectiveTimerEnds?: MessageWithAudio;
  objectiveReachesMin?: MessageWithAudio;
  objectiveReachesMax?: MessageWithAudio;
}
