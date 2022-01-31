import { FC } from 'react';

import { secondsToMinutes } from '../utils/formatters';

interface TimeLine {
  /**
   * In seconds
   */
  stepInterval: number;
  stepsAmount: number;
}

const TimeLine: FC<TimeLine> = ({ stepInterval, stepsAmount }) => (
  <div className="time-line">
    {Array(stepsAmount)
      .fill(0)
      .map((_value, index) => {
        const intervalTime = stepInterval * index;
        const { minutes, seconds } = secondsToMinutes(intervalTime);
        const formattedTime = `${minutes}:${seconds}`;

        return (
          <div key={formattedTime} className="time-line__element">
            <span> | </span>
            <span className="time-line__time">{formattedTime}</span>
          </div>
        );
      })}
  </div>
);

export default TimeLine;
