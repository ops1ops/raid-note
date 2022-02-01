import { FullEvent } from '../types/events';
import MRTNoteTemplater, { PlayerCastData } from '../templaters/MRTNoteTemplater';
import { secondsToMinutesText } from './formatters';

const getEventsWithoutTimeDuplicates = (events: PlayerCastData[]) => {
  const timePlayerCastMap = new Map<string, PlayerCastData>();

  events.forEach((event) => {
    const { time, spells: newSpells } = event;
    const playerCast = timePlayerCastMap.get(time);

    if (playerCast) {
      const { spells, ...rest } = playerCast;

      timePlayerCastMap.set(time, { ...rest, spells: [...spells, ...newSpells] });
    } else {
      timePlayerCastMap.set(time, event);
    }
  });

  return Array.from(timePlayerCastMap.values());
};

export const normalizeEvents = (events: FullEvent[], startTime: number) => {
  const formattedEvents: PlayerCastData[] = events.map(({ timestamp, source: { type, name }, ability: { guid } }) => {
    const time = secondsToMinutesText((timestamp - startTime) / 1000);

    return {
      time,
      type,
      name,
      spells: [guid],
    };
  });

  return getEventsWithoutTimeDuplicates(formattedEvents);
};

export const convertEventsToMRTNote = (events: PlayerCastData[]) =>
  events.reduce((accumulator, playerCast) => accumulator + MRTNoteTemplater.getRow(playerCast.time, [playerCast]), '');
