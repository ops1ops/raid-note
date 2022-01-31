import { SourceTypes } from '../types/source';
import { CLASSES_CONFIG } from '../classesConfig';

export interface PlayerCastData {
  type: SourceTypes;
  time: string;
  spells: number[];
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
    return spells.reduce((accumulator, spellId) => `${accumulator} ${MRTNoteTemplater.getSpell(spellId)}`, '');
  },

  getPlayerName(name: string, type: SourceTypes) {
    const { color } = CLASSES_CONFIG[type];

    return `${this.getColoredText(color, name)}`;
  },

  getRow(time: string, players: PlayerCastData[]) {
    const playersCasts = players.reduce((accumulator, { spells, name, type }, index) => {
      const isLastCast = players.length - 1 === index;
      const playersSeparator = isLastCast ? '' : ' |';

      return `${accumulator} ${this.getPlayerName(name, type)} ${this.getSeveralSpells(spells)}${playersSeparator}`;
    }, '');

    return `${this.getTime(time)} - ${playersCasts}\n`;
  },
};

export default MRTNoteTemplater;
