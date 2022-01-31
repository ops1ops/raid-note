export enum SourceTypes {
  DeathKnight = 'DeathKnight',
  DemonHunter = 'DemonHunter',
  Druid = 'Druid',
  Hunter = 'Hunter',
  Mage = 'Mage',
  Monk = 'Monk',
  Paladin = 'Paladin',
  Priest = 'Priest',
  Rogue = 'Rogue',
  Shaman = 'Shaman',
  Warlock = 'Warlock',
  Warrior = 'Warrior',
}

export interface Source {
  guid: number;
  icon: string;
  id: number;
  name: string;
  server: string;
  type: SourceTypes;
}
