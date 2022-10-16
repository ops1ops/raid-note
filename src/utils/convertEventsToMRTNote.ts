import { FullEvent } from '../types/events';
import MRTNoteTemplater, { PlayerCast, PlayerCastData } from '../templaters/MRTNoteTemplater';
import { secondsToMinutesText } from './formatters';

interface PlayerCastWithTime extends PlayerCast {
  time: string;
  timestamp: number;
}

const getEventsWithoutTimeDuplicates = (events: PlayerCastWithTime[]) => {
  const playersCastsByTime = events.reduce<Record<string, PlayerCastData>>((accumulator, event) => {
    const { time, spells: newSpells, sourceName, timestamp } = event;
    const playersCastsData = accumulator[time];

    if (playersCastsData) {
      const { playersCasts } = playersCastsData;
      const playerCasts = playersCasts.find(({ sourceName: name }) => sourceName === name);

      if (playerCasts) {
        playerCasts.spells = [...playerCasts.spells, ...newSpells];
      } else {
        playersCasts.push(event);
      }
    } else {
      accumulator[time] = {
        time,
        timestamp,
        playersCasts: [event],
      };
    }

    return accumulator;
  }, {});

  return Object.values(playersCastsByTime);
};

export const normalizeEvents = (events: FullEvent[], startTime: number) => {
  const formattedEvents: PlayerCastWithTime[] = events.map(
    ({ timestamp, source: { type, name }, ability: { guid } }) => {
      const time = secondsToMinutesText((timestamp - startTime) / 1000);

      return {
        time,
        timestamp,
        type,
        sourceName: name,
        spells: [guid],
      };
    },
  );

  const eventsWithoutTimeDuplicates = getEventsWithoutTimeDuplicates(formattedEvents);

  eventsWithoutTimeDuplicates.sort(({ timestamp: timeA }, { timestamp: timeB }) => timeA - timeB);

  return eventsWithoutTimeDuplicates;
};

export const convertEventsToMRTNote = (bossName: string, events: PlayerCastData[]) => {
  const noteText = events.reduce(
    (accumulator, { time, playersCasts }) => accumulator + MRTNoteTemplater.getRow(time, playersCasts),
    '',
  );

  return `${bossName}\n${noteText}`;
};
