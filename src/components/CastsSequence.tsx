import { useQuery } from '@apollo/client';
import { ChangeEvent, FC, useContext, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { EventTypes, FullEvent } from '../types/events';
import TimeLine from './TimeLine';
import { DurationUnits, getFightDuration } from '../utils/getFightDuration';
import Cast from './Cast';
import { PLAYER_EVENTS_CASTS, PlayerEventsCasts } from '../graphql/queries/playerEventsCasts';
import ResultText from './ResultText';
import { convertEventsToMRTNote, normalizeEvents } from '../utils/convertEventsToMRTNote';
import { SourceTypes } from '../types/source';
import { PALADIN_SAFE_CDS } from '../spells/paladin';
import { PRIEST_SAFE_CDS } from '../spells/priest';
import { analyzeDiscPriest } from '../analyzers/priest';
import AbilityIcon from './AbilityIcon';
import { Ability } from '../types/ability';
import { SettingsContext } from './context/SettingsContext';

const LINE_WIDTH = 3.21;
const TIME_LINE_STEP_WIDTH = 32 + LINE_WIDTH;
const STEP_INTERVAL = Number(process.env.REACT_APP_STEP_INTERVAL) || 1;

const SPELLS_PRESETS = {
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
  sourceType: SourceTypes;
  code: string;
  startTime: number;
  endTime: number;
  bossName: string;
}

const DEFAULT_NAME = '';

const getUniqAbilities = (events: FullEvent[]) => {
  const abilities = events.map(({ ability }) => ability);

  const uniqAbilitiesMap = abilities.reduce<Record<string, Ability>>(
    (accumulator, ability) => ({
      ...accumulator,
      [ability.guid]: ability,
    }),
    {},
  );

  return Object.values(uniqAbilitiesMap);
};

const CastsSequence: FC<CastsSequence> = ({ playerId, fightId, code, startTime, endTime, bossName, sourceType }) => {
  const [name, setName] = useState(DEFAULT_NAME);
  const [selectedAbilities, setSelectedAbilities] = useState<number[]>([]);
  const {
    settings: { isSmartAnalyzing, isSpellsPresetEnabled },
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
  const spellsToShow: number[] = SPELLS_PRESETS[sourceType];

  const filteredEvents = events.filter(({ ability: { guid }, type: eventType }) => {
    const isCastEvent = eventType === EventTypes.Cast;

    return isCastEvent && selectedAbilities.includes(guid);
  });

  const abilities = useMemo(() => getUniqAbilities(events), [events]);

  useEffect(() => {
    if (isSpellsPresetEnabled) {
      setSelectedAbilities((prevAbilities) => [...prevAbilities, ...spellsToShow]);
    } else {
      setSelectedAbilities((prevAbilities) => prevAbilities.filter((id) => !spellsToShow.includes(id)));
    }
  }, [isSpellsPresetEnabled, abilities]);

  if (loading) {
    return <span>Loading player casts...</span>;
  }

  const { seconds } = getFightDuration(startTime, endTime, DurationUnits.Seconds);

  const stepsAmount = Math.round(seconds / STEP_INTERVAL) + 1;

  const wholeTimeLineDuration = stepsAmount * STEP_INTERVAL;
  const wholeTimeLineWidth = TIME_LINE_STEP_WIDTH * stepsAmount;

  const handleInputChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => setName(value);

  const analyzedEvents = isSmartAnalyzing
    ? analyzeDiscPriest(filteredEvents, startTime)
    : normalizeEvents(filteredEvents, startTime);
  const eventsWithNeededName = name ? analyzedEvents.map((event) => ({ ...event, name })) : analyzedEvents;

  const note = `${bossName}\n${convertEventsToMRTNote(eventsWithNeededName)}`;

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
            <AbilityIcon name={abilityIcon} title={abilityName} />
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
      <input onChange={handleInputChange} value={name} />
      <ResultText title="MRT Note" text={note} />
    </div>
  );
};

export default CastsSequence;
