export function millisecondsToSeconds(ms: number): number {
  return ms / 1000;
}

export function secondsToMilliseconds(seconds: number): number {
  return seconds * 1000;
}

export function minutesToMilliseconds(minutes: number): number {
  return minutes * 60 * 1000;
}

export function millisecondsToMinutes(ms: number): number {
  return ms / (60 * 1000);
}

export function secondsToMinutes(seconds: number): number {
  return seconds / 60;
}

export function minutesToSeconds(minutes: number): number {
  return minutes * 60;
}
