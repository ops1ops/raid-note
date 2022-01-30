import { FC } from 'react';

import { EventTypes, FullEvent } from '../types/events';
import { getIconUrl, getWowHeadSpellUrl } from '../utils/urls';
import { secondsToMinutesText } from '../utils/formatters';
import { SourceTypes } from '../types/source';
import { PALADIN_SAFE_CDS } from '../spells/paladin';
import { PRIEST_SAFE_CDS } from '../spells/priest';

const SPELLS_TO_SHOW = {
  [SourceTypes.Paladin]: PALADIN_SAFE_CDS,
  [SourceTypes.Priest]: PRIEST_SAFE_CDS,
};

interface Cast {
  event: FullEvent;
  timeLineWidth: number;
  timeLineDuration: number;
  startTime: number;
}

const Cast: FC<Cast> = ({
  event: {
    ability: { abilityIcon, name, guid },
    source: { type: sourceType },
    type: eventType,
    timestamp,
  },
  startTime,
  timeLineDuration,
  timeLineWidth,
}) => {
  const spells: number[] = SPELLS_TO_SHOW[sourceType] || [];
  const isCastEvent = eventType === EventTypes.Cast;

  if (!isCastEvent || (spells.length > 0 && !spells.includes(guid))) {
    return null;
  }

  const iconUrl = getIconUrl(abilityIcon);

  const castedAt = (timestamp - startTime) / 1000;
  const castPosition = (castedAt / timeLineDuration) * timeLineWidth;
  const minutesText = secondsToMinutesText(castedAt);
  const castedAtInDifferentFormats = `${minutesText} | ${castedAt}`;

  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={getWowHeadSpellUrl(guid)}
      className="casts-sequence__cast"
      style={{ left: `${castPosition}px` }}
    >
      <img
        className="ability-icon"
        src={iconUrl}
        alt={name}
        width={24}
        height={24}
        title={castedAtInDifferentFormats}
      />
    </a>
  );
};

export default Cast;
