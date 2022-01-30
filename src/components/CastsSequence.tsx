import { useQuery } from '@apollo/client';
import { FC } from 'react';

import { FullEvent } from '../types/events';
import TimeLine from './TimeLine';
import { DurationUnits, getFightDuration } from '../utils/getFightDuration';
import Cast from './Cast';
import { PLAYER_EVENTS, PlayerEvents } from '../graphql/queries/playerEvents';

const LINE_WIDTH = 3.21;
const TIME_LINE_STEP_WIDTH = 32 + LINE_WIDTH;
const STEP_INTERVAL = 5;

interface CastSequence {
  playerId: number;
  fightId: number;
  code: string;
  startTime: number;
  endTime: number;
}

const CastsSequence: FC<CastSequence> = ({ playerId, fightId, code, startTime, endTime }) => {
  const { data } = useQuery<PlayerEvents>(PLAYER_EVENTS, {
    variables: {
      playerId,
      fightId,
      code,
      startTime,
      endTime,
    },
  });

  const events: FullEvent[] = data?.reportData.report.events.data || [];

  const { seconds } = getFightDuration(startTime, endTime, DurationUnits.Seconds);

  const stepsAmount = Math.round(seconds / STEP_INTERVAL) + 1;

  const wholeTimeLineDuration = stepsAmount * STEP_INTERVAL;
  const wholeTimeLineWidth = TIME_LINE_STEP_WIDTH * stepsAmount;

  return (
    <div className="container casts-sequence__container">
      <TimeLine duration={seconds} stepInterval={STEP_INTERVAL} />
      <div className="casts-sequence">
        {events.map((event) => (
          <Cast
            key={`${event.ability.guid}${event.timestamp}${event.ability.type}`}
            event={event}
            startTime={startTime}
            timeLineWidth={wholeTimeLineWidth}
            timeLineDuration={wholeTimeLineDuration}
          />
        ))}
      </div>
    </div>
  );
};

export default CastsSequence;
