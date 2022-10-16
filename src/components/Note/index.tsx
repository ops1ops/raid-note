import { ChangeEvent, FC, Fragment, memo, useContext, useState } from 'react';

import './styles.scss';
import { convertEventsToMRTNote, normalizeEvents } from '../../utils/convertEventsToMRTNote';
import { FullEvent } from '../../types/events';
import { SettingsContext } from '../context/SettingsContext';
import AbilityIcon from '../AbilityIcon';
import { getAbilitiesMap } from '../../utils/abilities';

interface NoteProps {
  startTime: number;
  events: FullEvent[];
  bossName: string;
}

const Note: FC<NoteProps> = ({ events, bossName, startTime }) => {
  const {
    settings: { isPrettyNoteFormat },
  } = useContext(SettingsContext);
  const [customSourceName, setCustomSourceName] = useState('');

  const handleInputChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => setCustomSourceName(value);

  const abilitiesMap = getAbilitiesMap(events);
  const normalizedEvents = normalizeEvents(events, startTime);

  const noteText = isPrettyNoteFormat ? '' : convertEventsToMRTNote(bossName, normalizedEvents);

  return (
    <div className="note">
      <input placeholder="Custom name" onChange={handleInputChange} value={customSourceName} />
      <details>
        <summary>MRT Note</summary>
        {isPrettyNoteFormat ? (
          <div className="note__text">
            {normalizedEvents.map(({ time, playersCasts }) => (
              <div key={time} className="note__row">
                <span className="note__time">{time}</span>
                <span>-</span>
                {playersCasts.map(({ sourceName, type, text, spells }, index) => (
                  <Fragment key={sourceName}>
                    <span className={type}>{sourceName}</span>
                    {text && <span>{text}</span>}
                    {spells.map((id) => {
                      const { abilityIcon, name } = abilitiesMap[id];

                      return <AbilityIcon key={id} size={20} icon={abilityIcon} name={name} />;
                    })}
                    {index !== playersCasts.length - 1 && <span>|</span>}
                  </Fragment>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="note__text">{noteText}</p>
        )}
      </details>
    </div>
  );
};

export default memo(Note);
