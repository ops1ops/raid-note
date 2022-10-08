import { useQuery } from '@apollo/client';
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { EventTypes } from '../../types/events';
import TimeLine from '../TimeLine';
import { DurationUnits, getFightDuration } from '../../utils/getFightDuration';
import Cast from '../Cast';
import { PLAYER_EVENTS_CASTS, PlayerEventsCasts } from '../../graphql/queries/playerEventsCasts';
import Note from '../Note';
import { SourceTypes } from '../../types/source';
import AbilityIcon from '../AbilityIcon';
import { SettingsContext } from '../context/SettingsContext';
import { getUniqAbilities } from '../../utils/abilities';
import { SPELLS_PRESETS } from './constants';

const LINE_WIDTH = 4.16;
const GAP = 32;
const TIME_LINE_STEP_WIDTH = GAP + LINE_WIDTH;
const STEP_INTERVAL = Number(process.env.REACT_APP_STEP_INTERVAL) || 1;

interface CastsSequenceProps {
  playerId: number;
  fightId: number;
  sourceType: SourceTypes;
  code: string;
  startTime: number;
  endTime: number;
  bossName: string;
}

const CastsSequence: FC<CastsSequenceProps> = ({
  playerId,
  fightId,
  code,
  startTime,
  endTime,
  bossName,
  sourceType,
}) => {
  const [selectedAbilities, setSelectedAbilities] = useState<number[]>([]);
  const {
    settings: { isSpellsPresetEnabled },
  } = useContext(SettingsContext);

  const { data, loading } = useQuery<PlayerEventsCasts>(PLAYER_EVENTS_CASTS, {
    variables: {
      playerId,
      fightId,
      code,
      startTime,
      endTime,
    },
  });

  const events = data?.reportData.report.events.data || [];
  const spellsPresets = SPELLS_PRESETS[sourceType] || [];

  const filteredEvents = events.filter(({ ability: { guid }, type: eventType }) => {
    const isCastEvent = eventType === EventTypes.Cast;

    return isCastEvent && selectedAbilities.includes(guid);
  });

  const abilities = useMemo(() => getUniqAbilities(events), [events]);

  useEffect(() => {
    if (isSpellsPresetEnabled) {
      setSelectedAbilities((prevAbilities) => [...prevAbilities, ...spellsPresets]);
    } else {
      setSelectedAbilities((prevAbilities) => prevAbilities.filter((id) => !spellsPresets.includes(id)));
    }
  }, [isSpellsPresetEnabled]);

  if (loading) {
    return <span>Loading player casts...</span>;
  }

  const { seconds } = getFightDuration(startTime, endTime, DurationUnits.Seconds);

  const stepsAmount = Math.round(seconds / STEP_INTERVAL) + 1;
  const wholeTimeLineDuration = stepsAmount * STEP_INTERVAL;
  const wholeTimeLineWidth = TIME_LINE_STEP_WIDTH * stepsAmount;

  const createClickHandler = (newId: number) => () => {
    setSelectedAbilities((prevAbilities) => {
      const existingIdIndex = prevAbilities.indexOf(newId);

      if (existingIdIndex > -1) {
        return prevAbilities.filter((id) => id !== newId);
      }

      return [...prevAbilities, newId];
    });
  };

  return (
    <div className="container player-casts">
      <div className="abilities-filter">
        {abilities.map(({ guid, name: abilityName, abilityIcon }) => (
          <button
            key={guid}
            onClick={createClickHandler(guid)}
            type="button"
            className={classNames('filter-button', { 'filter-button--active': selectedAbilities.includes(guid) })}
          >
            <AbilityIcon icon={abilityIcon} name={abilityName} />
          </button>
        ))}
      </div>
      <div className="casts-sequence">
        <TimeLine stepsAmount={stepsAmount} stepInterval={STEP_INTERVAL} />
        {filteredEvents.map((event) => {
          if (!selectedAbilities.includes(event.ability.guid)) return null;

          return (
            <Cast
              key={`${event.ability.guid}-${event.source.guid}-${event.target.guid}-${event.timestamp}`}
              event={event}
              startTime={startTime}
              timeLineWidth={wholeTimeLineWidth}
              timeLineDuration={wholeTimeLineDuration}
            />
          );
        })}
      </div>
      <Note startTime={startTime} bossName={bossName} events={filteredEvents} />
    </div>
  );
};

export default CastsSequence;
