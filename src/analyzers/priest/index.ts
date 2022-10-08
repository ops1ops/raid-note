import { FullEvent } from '../../types/events';
import { PriestSpells } from '../../spells/priest';
import { PlayerCastData } from '../../templaters/MRTNoteTemplater';
import { secondsToMinutesText } from '../../utils/formatters';
import { RAMP_BURST_VARIANTS, TIME_TO_PREPARE_RAMP_S } from './constants';

interface PlayerCastWithTimestamp extends PlayerCastData {
  timestamp: number;
}

const findRampEvents = (events: FullEvent[], startTime: number): PlayerCastWithTimestamp[] => {
  const result: PlayerCastWithTimestamp[] = [];

  RAMP_BURST_VARIANTS.forEach((spellSequence) => {
    for (let i = 0; i < events.length - spellSequence.length + 1; i += 1) {
      let success = true;

      for (let j = 0; j < spellSequence.length; j += 1) {
        const event = events[i + j];

        if (event.ability.guid !== spellSequence[j]) {
          success = false;
          break;
        }
      }

      if (success) {
        const {
          source: { name, type },
          timestamp,
        } = events[i];
        const burstStartTimeS = (timestamp - startTime) / 1000;
        const prepareStartTimeS = burstStartTimeS - TIME_TO_PREPARE_RAMP_S;

        result.push(
          {
            sourceName: name,
            type,
            spells: [PriestSpells.ShadowMend, PriestSpells.PowerWordShield],
            time: secondsToMinutesText(prepareStartTimeS),
            text: 'Ramp prepare',
            timestamp: prepareStartTimeS,
          },
          {
            sourceName: name,
            type,
            spells: [PriestSpells.SpiritShell],
            time: secondsToMinutesText(burstStartTimeS),
            text: 'Ramp burst',
            timestamp: burstStartTimeS,
          },
        );
      }
    }
  });

  return result;
};

export const analyzeDiscPriest = (events: FullEvent[], startTime: number): PlayerCastWithTimestamp[] => {
  const rampEvents = findRampEvents(events, startTime);

  rampEvents.sort(({ timestamp: timeA }, { timestamp: timeB }) => timeA - timeB);

  return rampEvents;
};
