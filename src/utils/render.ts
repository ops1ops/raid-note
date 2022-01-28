const ICONS_SOURCE_DIRECTORY_URL = 'https://render.worldofwarcraft.com/us/icons/56';
const DEFAULT_ICON_NAME = 'creatureportrait_illidancrystal01.jpg';

export const getIconUrl = (icon: string = DEFAULT_ICON_NAME): string =>
  `${ICONS_SOURCE_DIRECTORY_URL}/${icon}`;

const WOW_HEAD_SPELL_URL = 'https://www.wowhead.com/spell';

export const getWowHeadUrl = (spellId: number) => `${WOW_HEAD_SPELL_URL}=${spellId}`;

