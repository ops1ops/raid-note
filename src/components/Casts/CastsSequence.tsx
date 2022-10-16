import { FC } from 'react';

import Cast from '../Cast';
import { FullEvent } from '../../types/events';

interface CastsSequenceProps {
  events: FullEvent[];
  startTime: number;
  timeLineWidth: number;
  timeLineDuration: number;
}

const CastsSequence: FC<CastsSequenceProps> = ({ events, startTime, timeLineDuration, timeLineWidth }) => (
  <div className="casts-sequence">
    {events.map((event) => (
      <Cast
        key={`${event.ability.guid}-${event.source.guid}-${event.target.guid}-${event.timestamp}`}
        event={event}
        startTime={startTime}
        timeLineWidth={timeLineWidth}
        timeLineDuration={timeLineDuration}
      />
    ))}
  </div>
);

export default CastsSequence;
