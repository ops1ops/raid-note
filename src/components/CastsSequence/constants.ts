import { SourceTypes } from '../../types/source';
import { PALADIN_MAJOR_SPELLS } from '../../spells/paladin';
import { PRIEST_MAJOR_SPELLS } from '../../spells/priest';
import { DEATH_KNIGHT_MAJOR_SPELLS } from '../../spells/deathKnight';

export const SPELLS_PRESETS: Record<SourceTypes, number[]> = {
  [SourceTypes.Paladin]: PALADIN_MAJOR_SPELLS,
  [SourceTypes.Priest]: PRIEST_MAJOR_SPELLS,
  [SourceTypes.DeathKnight]: DEATH_KNIGHT_MAJOR_SPELLS,
  [SourceTypes.DemonHunter]: [],
  [SourceTypes.Druid]: [],
  [SourceTypes.Hunter]: [],
  [SourceTypes.Mage]: [],
  [SourceTypes.Monk]: [],
  [SourceTypes.Rogue]: [],
  [SourceTypes.Shaman]: [],
  [SourceTypes.Warlock]: [],
  [SourceTypes.Warrior]: [],
};
