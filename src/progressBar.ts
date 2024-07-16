export function getProgressBar(progress: number) {
  const barCharsLength = 30;
  const filledLength = Math.round(progress * barCharsLength);

  const emptyChar = "░";
  const filledChar = "█";

  const filledPart = filledChar.repeat(filledLength);
  const emptyPart = emptyChar.repeat(barCharsLength - filledLength);

  const percentage = (progress * 100).toFixed(2);

  return `[${filledPart}${emptyPart}]`;
}
