export function getProgressBar(progress: number) {
  const barCharsLength = 30;
  let filledLength = Math.round(progress * barCharsLength);

  const emptyChar = "░";
  const filledChar = "█";
  let emptyLength = barCharsLength - filledLength;

  if (emptyLength <= 0) {
    filledLength = barCharsLength;
    emptyLength = 0;
  }

  const filledPart = filledChar.repeat(filledLength);
  const emptyPart = emptyChar.repeat(emptyLength);

  return `[${filledPart}${emptyPart}]`;
}
