const ICONS_SOURCE_DIRECTORY_URL = 'https://render.worldofwarcraft.com/eu/icons/56';

export const getIconUrl = (icon: string): string => {
  const formattedIcon = icon.replaceAll('-', '');

  return `${ICONS_SOURCE_DIRECTORY_URL}/${formattedIcon}`;
};

const WOW_HEAD_SPELL_URL = 'https://www.wowhead.com/spell';

export const getWowHeadSpellUrl = (spellId: number) => `${WOW_HEAD_SPELL_URL}=${spellId}`;
