import { SourceTypes } from '../types/source';
import { CLASSES_CONFIG } from '../classesConfig';

export interface PlayerCastData {
  type: SourceTypes;
  time: string;
  spells: number[];
  text?: string;
  name: string;
}

/**
 * Method Raid Tools note templater
 * @description includes several methods which can help with note creation
 * @description last supported MRT version 4600
 */
const MRTNoteTemplater = {
  getColoredText(color: string, text: string) {
    return `|cff${color}${text}|r`;
  },

  getTime(minutes: string) {
    return `{time:${minutes}}`;
  },

  getSpell(spellId: number) {
    return `{spell:${spellId}}`;
  },

  getSeveralSpells(spells: number[]) {
    const convertedSpells = spells.map((spellId) => this.getSpell(spellId));

    return convertedSpells.join(' ');
  },

  getPlayerName(name: string, type: SourceTypes) {
    const { color } = CLASSES_CONFIG[type];

    return `${this.getColoredText(color, name)}`;
  },

  getRow(time: string, players: PlayerCastData[]) {
    const playersCasts = players.reduce((accumulator, { spells, name, type, text }, index) => {
      const isLastCast = players.length - 1 === index;
      const playersSeparator = isLastCast ? '' : '|';
      const textToShow = text || '';

      const elements = [
        accumulator,
        this.getPlayerName(name, type),
        textToShow,
        this.getSeveralSpells(spells),
        playersSeparator,
      ].filter(Boolean);

      return elements.join(' ');
    }, '');

    return `${this.getTime(time)} - ${playersCasts}\n`;
  },
};

export default MRTNoteTemplater;
