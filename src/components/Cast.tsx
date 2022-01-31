import { FC } from 'react';

import { FullEvent } from '../types/events';
import { getIconUrl, getWowHeadSpellUrl } from '../utils/urls';
import { secondsToMinutesText } from '../utils/formatters';

interface Cast {
  event: FullEvent;
  timeLineWidth: number;
  timeLineDuration: number;
  startTime: number;
}

const Cast: FC<Cast> = ({
  event: {
    ability: { abilityIcon, name, guid },
    timestamp,
  },
  startTime,
  timeLineDuration,
  timeLineWidth,
}) => {
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
