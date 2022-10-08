import { ChangeEvent, FC, useContext, useState } from 'react';

import './styles.scss';
import { convertEventsToMRTNote, normalizeEvents } from '../../utils/convertEventsToMRTNote';
import { analyzeDiscPriest } from '../../analyzers/priest';
import { FullEvent } from '../../types/events';
import { SettingsContext } from '../context/SettingsContext';

interface NoteProps {
  startTime: number;
  events: FullEvent[];
  bossName: string;
}

// TODO: add pretty view switch

const Note: FC<NoteProps> = ({ events, bossName, startTime }) => {
  const {
    settings: { isSmartAnalyzing },
  } = useContext(SettingsContext);
  const [customSourceName, setCustomSourceName] = useState('');

  const handleInputChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => setCustomSourceName(value);

  const normalizedEvents = isSmartAnalyzing ? analyzeDiscPriest(events, startTime) : normalizeEvents(events, startTime);

  const eventsWithNeededName = customSourceName
    ? normalizedEvents.map((event) => ({ ...event, sourceName: customSourceName }))
    : normalizedEvents;

  const noteText = convertEventsToMRTNote(bossName, eventsWithNeededName);

  return (
    <div className="note">
      <input placeholder="Custom name" onChange={handleInputChange} value={customSourceName} />
      <details>
        <summary>MRT Note</summary>
        <p>{noteText}</p>
      </details>
    </div>
  );
};

export default Note;
