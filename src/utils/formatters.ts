export const secondsToMinutes = (seconds: number) => ({
  minutes: Math.floor(seconds / 60),
  seconds: Math.round(seconds % 60),
});

export const secondsToMinutesText = (wholeSeconds: number) => {
  const { minutes, seconds } = secondsToMinutes(wholeSeconds);

  return `${minutes}:${seconds}`;
};
