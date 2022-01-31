import { useQuery } from '@apollo/client';
import { FC } from 'react';

import { EventTypes } from '../types/events';
import TimeLine from './TimeLine';
import { DurationUnits, getFightDuration } from '../utils/getFightDuration';
import Cast from './Cast';
import { PLAYER_EVENTS_CASTS, PlayerEventsCasts } from '../graphql/queries/playerEventsCasts';
import ResultText from './ResultText';
import { convertEventsToMRTNote } from '../utils/convertEventsToMRTNote';
import { SourceTypes } from '../types/source';
import { PALADIN_SAFE_CDS } from '../spells/paladin';
import { PRIEST_SAFE_CDS } from '../spells/priest';

const LINE_WIDTH = 3.21;
const TIME_LINE_STEP_WIDTH = 32 + LINE_WIDTH;
const STEP_INTERVAL = 5;

const SPELLS_TO_SHOW = {
  [SourceTypes.Paladin]: PALADIN_SAFE_CDS,
  [SourceTypes.Priest]: PRIEST_SAFE_CDS,
  [SourceTypes.DeathKnight]: [],
  [SourceTypes.DemonHunter]: [],
  [SourceTypes.Druid]: [],
  [SourceTypes.Hunter]: [],
  [SourceTypes.Mage]: [],
  [SourceTypes.Monk]: [],
  [SourceTypes.Rogue]: [],
  [SourceTypes.Shaman]: [],
  [SourceTypes.Warlock]: [],
  [SourceTypes.Warrior]: [],
};

interface CastsSequence {
  playerId: number;
  fightId: number;
  code: string;
  startTime: number;
  endTime: number;
}

const CastsSequence: FC<CastsSequence> = ({ playerId, fightId, code, startTime, endTime }) => {
  const { data, loading } = useQuery<PlayerEventsCasts>(PLAYER_EVENTS_CASTS, {
    variables: {
      playerId,
      fightId,
      code,
      startTime,
      endTime,
    },
  });

  if (loading) {
    return <span>Loading player casts...</span>;
  }

  const events = data?.reportData.report.events.data || [];

  const filteredEvents = events.filter(({ source: { type }, ability: { guid }, type: eventType }) => {
    const spells: number[] = SPELLS_TO_SHOW[type];
    const isCastEvent = eventType === EventTypes.Cast;

    return isCastEvent && (spells.length === 0 || spells.includes(guid));
  });

  const { seconds } = getFightDuration(startTime, endTime, DurationUnits.Seconds);

  const stepsAmount = Math.round(seconds / STEP_INTERVAL) + 1;

  const wholeTimeLineDuration = stepsAmount * STEP_INTERVAL;
  const wholeTimeLineWidth = TIME_LINE_STEP_WIDTH * stepsAmount;

  const note = convertEventsToMRTNote(filteredEvents, startTime);

  return (
    <>
      <div className="container casts-sequence__container">
        <TimeLine stepsAmount={stepsAmount} stepInterval={STEP_INTERVAL} />
        <div className="casts-sequence">
          {filteredEvents.map((event) => (
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
      <ResultText title="MRT Note" text={note} />
    </>
  );
};

export default CastsSequence;
