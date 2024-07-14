import { formatTime } from "./utils.js";

type Timer = {
  startTime: number;
  timeLimit: number;
  isRunning: boolean;
  stoppedTime?: number; // Separate property for storing stopped time
};

export class TimeManager {
  private timers: Map<string, Timer>;

  constructor() {
    this.timers = new Map<string, Timer>();
  }

  setTimer(name: string, timeLimitSeconds: number): void {
    const currentTime = Date.now();
    this.timers.set(name, {
      startTime: currentTime,
      timeLimit: timeLimitSeconds * 1000, // Convert seconds to milliseconds
      isRunning: false, // Timer is set but not started yet
    });
  }

  startTimer(name: string): void {
    const timer = this.timers.get(name);
    const currentTime = Date.now();
    if (timer) {
      timer.isRunning = true;
      timer.startTime = currentTime;
    }
  }

  stopTimer(name: string): void {
    const timer = this.timers.get(name);
    if (timer && timer.isRunning) {
      timer.isRunning = false;
      timer.stoppedTime = Date.now(); // Store the current time as stopped time
    }
  }

  getElapsedTimeMs(name: string): number {
    const timer = this.timers.get(name);
    if (!timer) return 0;
    return Date.now() - timer.startTime;
  }

  getElapsedTimeInSeconds(name: string): number {
    return this.getElapsedTimeMs(name) / 1000;
  }

  getElapsedTimeInMinutes(name: string): number {
    return this.getElapsedTimeInSeconds(name) / 60;
  }

  getElapsedTimeFormatted(name: string): string {
    return formatTime(this.getElapsedTimeMs(name));
  }

  getEndTime(name: string): number {
    const timer = this.timers.get(name);
    if (!timer) return 0;
    return timer.startTime + timer.timeLimit;
  }

  getTimeRemaining(name: string): number {
    const timer = this.timers.get(name);
    if (!timer) return 0;
    if (!timer.isRunning) {
      // Calculate remaining time based on stopped time if timer is not running
      const elapsedTime = timer.stoppedTime
        ? timer.stoppedTime - timer.startTime
        : 0;
      return Math.max(timer.timeLimit - elapsedTime, 0); // Ensure time remaining is not negative
    }
    const endTime = this.getEndTime(name);
    const timeRemaining = endTime - Date.now();
    return timeRemaining > 0 ? timeRemaining : 0;
  }

  getTimeRemainingFormatted(name: string): string {
    return formatTime(this.getTimeRemaining(name));
  }

  resetStartTime(name: string, timeLimitSeconds: number): void {
    const currentTime = Date.now();
    this.timers.set(name, {
      startTime: currentTime,
      timeLimit: timeLimitSeconds * 1000, // Convert seconds to milliseconds
      isRunning: true,
    });
  }

  clearTimer(name: string): void {
    this.timers.delete(name);
  }

  isTimerEnded(name: string): boolean {
    const timer = this.timers.get(name);
    if (!timer) return false;
    if (!timer.isRunning) return true;
    const endTime = this.getEndTime(name);
    return Date.now() >= endTime;
  }
}
