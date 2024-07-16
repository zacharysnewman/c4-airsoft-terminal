export function getProgressBar(progress: number) {
  const barCharsLength = 30;
  const filledLength = Math.round(progress * barCharsLength);

  const emptyChar = "░";
  const filledChar = "█";

  const filledPart = filledChar.repeat(filledLength);
  const emptyPart = emptyChar.repeat(barCharsLength - filledLength);

  return `[${filledPart}${emptyPart}]`;
}
