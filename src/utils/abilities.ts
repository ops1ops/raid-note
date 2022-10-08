import { FullEvent } from '../types/events';
import { Ability } from '../types/ability';

export const getUniqAbilities = (events: FullEvent[]) => {
  const uniqAbilitiesMap = events.reduce<Record<string, Ability>>(
    (accumulator, { ability }) => ({
      ...accumulator,
      [ability.guid]: ability,
    }),
    {},
  );

  return Object.values(uniqAbilitiesMap);
};
