import { secondsToMinutes } from './formatters';

export enum DurationUnits {
  Seconds = 's',
  Minutes = 'm',
}

export const getFightDuration = (startTime: number, endTime: number, unit: DurationUnits = DurationUnits.Minutes) => {
  const fightDurationInMs = endTime - startTime;
  const fightDurationInS = fightDurationInMs / 1000;

  const result = {
    [DurationUnits.Seconds]: { minutes: 0, seconds: fightDurationInS },
    [DurationUnits.Minutes]: secondsToMinutes(fightDurationInS),
  };

  return result[unit];
};
