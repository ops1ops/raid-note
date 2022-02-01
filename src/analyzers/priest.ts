import { FullEvent } from '../types/events';
import { PriestSpells } from '../spells/priest';
import { PlayerCastData } from '../templaters/MRTNoteTemplater';
import { secondsToMinutesText } from '../utils/formatters';

const RAMP_BURST_VARIANTS = [
  [
    PriestSpells.PowerWordRadiance,
    PriestSpells.BoonOfTheAscended,
    PriestSpells.SpiritShell,
    PriestSpells.AscendedBlast,
    PriestSpells.PowerWordRadiance,
  ],
  [
    PriestSpells.PowerWordRadiance,
    PriestSpells.BoonOfTheAscended,
    PriestSpells.AscendedBlast,
    PriestSpells.SpiritShell,
    PriestSpells.PowerWordRadiance,
  ],
  [
    PriestSpells.PowerWordRadiance,
    PriestSpells.BoonOfTheAscended,
    PriestSpells.AscendedBlast,
    PriestSpells.PowerWordRadiance,
    PriestSpells.SpiritShell,
  ],
  // Shadowfiend bursts
  [PriestSpells.PowerWordRadiance, PriestSpells.PowerWordRadiance, PriestSpells.Shadowfiend, PriestSpells.SpiritShell],
  [PriestSpells.PowerWordRadiance, PriestSpells.PowerWordRadiance, PriestSpells.SpiritShell, PriestSpells.Shadowfiend],
  [PriestSpells.PowerWordRadiance, PriestSpells.PowerWordRadiance, PriestSpells.SpiritShell],
  [PriestSpells.PowerWordRadiance, PriestSpells.Shadowfiend, PriestSpells.PowerWordRadiance, PriestSpells.SpiritShell],
  [PriestSpells.PowerWordRadiance, PriestSpells.SpiritShell, PriestSpells.Shadowfiend],
  [PriestSpells.PowerWordRadiance, PriestSpells.SpiritShell, PriestSpells.Shadowfiend, PriestSpells.PowerWordRadiance],
];

const TIME_TO_PREPARE_RAMP = 11;

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
        const burstStartTime = (timestamp - startTime) / 1000;
        const prepareStartTime = (timestamp - startTime) / 1000 - TIME_TO_PREPARE_RAMP;

        result.push(
          {
            name,
            type,
            spells: [PriestSpells.ShadowMend, PriestSpells.PowerWordShield],
            time: secondsToMinutesText(prepareStartTime),
            text: 'Ramp prepare',
            timestamp: prepareStartTime,
          },
          {
            name,
            type,
            spells: [PriestSpells.SpiritShell],
            time: secondsToMinutesText(burstStartTime),
            text: 'Ramp burst',
            timestamp: burstStartTime,
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
