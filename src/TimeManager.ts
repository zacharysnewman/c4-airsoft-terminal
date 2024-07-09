import { formatTime } from "./utils.js";

export class TimeManager {
  private startTime: number;
  private timeLimitMinutes: number;

  constructor() {
    this.startTime = Date.now();
    this.timeLimitMinutes = 0;
  }

  getElapsedTimeMs(): number {
    return Date.now() - this.startTime;
  }

  getElapsedTimeInSeconds(): number {
    return this.getElapsedTimeMs() / 1000;
  }

  getElapsedTimeInMinutes(): number {
    return this.getElapsedTimeInSeconds() / 60;
  }

  getElapsedTimeFormatted(): string {
    return formatTime(this.getElapsedTimeMs());
  }

  getEndTime() {
    return this.startTime + this.timeLimitMinutes * 60 * 1000;
  }

  getTimeRemaining() {
    const endTime = this.getEndTime();
    return endTime - Date.now();
  }

  getTimeRemainingFormatted() {
    return formatTime(this.getTimeRemaining());
  }

  resetStartTime(timeLimitMinutes: number): void {
    this.startTime = Date.now();
    this.timeLimitMinutes = timeLimitMinutes;
  }
}
