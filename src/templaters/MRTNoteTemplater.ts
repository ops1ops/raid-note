import { SourceTypes } from '../types/source';
import { CLASSES_CONFIG } from '../configs/classesConfig';

export interface PlayerCast {
  type: SourceTypes;
  spells: number[];
  text?: string;
  sourceName: string;
}

export interface PlayerCastData {
  time: string;
  timestamp: number;
  playersCasts: PlayerCast[];
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

  getSpells(spells: number[]) {
    const convertedSpells = spells.map((spellId) => this.getSpell(spellId));

    return convertedSpells.join(' ');
  },

  getPlayerName(name: string, type: SourceTypes) {
    const { color } = CLASSES_CONFIG[type];

    return `${this.getColoredText(color, name)}`;
  },

  getRow(minutesText: string, players: PlayerCast[]) {
    const playersCasts = players.reduce((accumulator, { spells, sourceName, type, text }, index) => {
      const isLastCast = players.length - 1 === index;
      const playersSeparator = isLastCast ? '' : '|';
      const textToShow = text || '';

      const elements = [
        accumulator,
        this.getPlayerName(sourceName, type),
        textToShow,
        this.getSpells(spells),
        playersSeparator,
      ].filter(Boolean);

      return elements.join(' ');
    }, '');

    return `${this.getTime(minutesText)} - ${playersCasts}\n`;
  },
};

export default MRTNoteTemplater;
