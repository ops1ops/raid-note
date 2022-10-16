import { FullEvent } from '../types/events';
import { Ability } from '../types/ability';

export const getAbilitiesMap = (events: FullEvent[]) =>
  events.reduce<Record<string, Ability>>(
    (accumulator, { ability }) => ({
      ...accumulator,
      [ability.guid]: ability,
    }),
    {},
  );

export const getUniqAbilities = (events: FullEvent[]) => {
  const uniqAbilitiesMap = getAbilitiesMap(events);

  return Object.values(uniqAbilitiesMap);
};
