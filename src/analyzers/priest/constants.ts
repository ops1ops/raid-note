import { PriestSpells } from '../../spells/priest';

export const RAMP_BURST_VARIANTS = [
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

export const TIME_TO_PREPARE_RAMP_S = 11;
