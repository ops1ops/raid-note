import { FC } from 'react';

import { FullEvent } from '../types/events';
import { getWowHeadSpellUrl } from '../utils/urls';
import AbilityIcon from './AbilityIcon';

interface Cast {
  event: FullEvent;
  timeLineWidth: number;
  timeLineDuration: number;
  startTime: number;
}

const Cast: FC<Cast> = ({
  event: {
    ability: { abilityIcon, guid },
    timestamp,
  },
  startTime,
  timeLineDuration,
  timeLineWidth,
}) => {
  const castedAt = (timestamp - startTime) / 1000;
  const castPosition = (castedAt / timeLineDuration) * timeLineWidth;
  const castTitle = castedAt.toString();

  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={getWowHeadSpellUrl(guid)}
      className="casts-sequence__cast"
      style={{ left: `${castPosition}px` }}
    >
      <AbilityIcon icon={abilityIcon} name={castTitle} />
    </a>
  );
};

export default Cast;
