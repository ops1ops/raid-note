import { useQuery } from '@apollo/client';
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { EventTypes, FullEvent } from '../../types/events';
import TimeLine from '../TimeLine';
import { DurationUnits, getFightDuration } from '../../utils/getFightDuration';
import Cast from '../Cast';
import { getPlayersEventsCastsQuery, PlayersEventsCasts } from '../../graphql/queries/playersEventsCasts';
import Note from '../Note';
import { SourceTypes } from '../../types/source';
import AbilityIcon from '../AbilityIcon';
import { SettingsContext } from '../context/SettingsContext';
import { getUniqAbilities } from '../../utils/abilities';
import { SPELLS_PRESETS } from './constants';
import { Player } from '../../types/player';
import CastsSequence from './CastsSequence';
import './styles.scss';

const LINE_WIDTH = 4.16;
const GAP = 32;
const TIME_LINE_STEP_WIDTH = GAP + LINE_WIDTH;
const STEP_INTERVAL = Number(process.env.REACT_APP_STEP_INTERVAL) || 1;

interface CastsProps {
  players: Player[];
  fightId: number;
  code: string;
  startTime: number;
  endTime: number;
  bossName: string;
}

const Casts: FC<CastsProps> = ({ players, fightId, code, startTime, endTime, bossName }) => {
  const [selectedAbilities, setSelectedAbilities] = useState<number[]>([]);
  const {
    settings: { isSpellsPresetEnabled },
  } = useContext(SettingsContext);

  const playersId = players.map(({ id }) => id);
  const playersEventsCastsQuery = getPlayersEventsCastsQuery(playersId);

  const { data = {}, loading } = useQuery<PlayersEventsCasts>(playersEventsCastsQuery, {
    variables: {
      fightId,
      code,
      startTime,
      endTime,
    },
  });

  const playersReports = Object.values(data);
  const events = playersReports.reduce<FullEvent[]>(
    (accumulator, reportData) => [...accumulator, ...reportData.report.events.data],
    [],
  );
  const spellsPresets = SPELLS_PRESETS[SourceTypes.Priest] || [];

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
  }, [isSpellsPresetEnabled, spellsPresets]);

  if (loading) {
    return <span>Loading players casts...</span>;
  }

  const { seconds } = getFightDuration(startTime, endTime, DurationUnits.Seconds);

  const stepsAmount = Math.round(seconds / STEP_INTERVAL) + 1;
  const wholeTimeLineDuration = stepsAmount * STEP_INTERVAL;
  const wholeTimeLineWidth = TIME_LINE_STEP_WIDTH * stepsAmount;

  const createClickHandler = (newId: number) => () => {
    setSelectedAbilities((prevAbilities) => {
      const existingIdIndex = prevAbilities.indexOf(newId);

      if (existingIdIndex > -1) {
        const newAbilities = [...prevAbilities];

        newAbilities.splice(existingIdIndex, 1);

        return newAbilities;
      }

      return [...prevAbilities, newId];
    });
  };

  return (
    <div className="container casts">
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
      <div className="casts-sequences">
        <TimeLine stepsAmount={stepsAmount} stepInterval={STEP_INTERVAL} />
        {Object.entries(data).map(([key, reportData]) => (
          <CastsSequence
            key={key}
            events={reportData.report.events.data}
            timeLineDuration={wholeTimeLineDuration}
            timeLineWidth={wholeTimeLineWidth}
            startTime={startTime}
          />
        ))}
      </div>
      <Note startTime={startTime} bossName={bossName} events={filteredEvents} />
    </div>
  );
};

export default Casts;
