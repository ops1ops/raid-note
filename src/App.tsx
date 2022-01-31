import { useLazyQuery } from '@apollo/client';
import { ChangeEvent, useState } from 'react';
import Select, { MultiValue } from 'react-select';

import PlayersList from './components/PlayersList';
import { parseReportUrl } from './utils/parseReportUrl';
import CastsSequence from './components/CastsSequence';
import { DurationUnits, getFightDuration } from './utils/getFightDuration';
import { secondsToMinutesText } from './utils/formatters';
import { playerDetailsToSelectOptions } from './utils/normalizers';
import { REPORT_FIGHT, ReportFight } from './graphql/queries/reportFight';
import { FIGHT_PLAYER_DETAILS, FightPlayerDetails } from './graphql/queries/fightPlayerDetails';
import './App.scss';

interface Option {
  value: number;
  label: string;
}

const DEFAULT_REPORT_LINK = 'https://www.warcraftlogs.com/reports/WMv4Jz92HK3Z8raD#fight=5';

const App = () => {
  const [reportLink, setReportLink] = useState(DEFAULT_REPORT_LINK);
  const [selectedPlayers, setSelectedPlayers] = useState<MultiValue<Option>>([]);

  const [getReportFight, { loading: reportFightLoading, data: reportFightData }] =
    useLazyQuery<ReportFight>(REPORT_FIGHT);
  const [getPlayersDetails, { data: playersDetails, loading: playersDetailsLoading }] =
    useLazyQuery<FightPlayerDetails>(FIGHT_PLAYER_DETAILS);

  if (playersDetailsLoading || reportFightLoading) {
    return <span>Loading...</span>;
  }

  const { fightId, code } = parseReportUrl(reportLink);

  const fetchReport = async () => {
    setSelectedPlayers([]);

    const { data } = await getReportFight({ variables: { fightId, code } });
    const [{ startTime, endTime }] = data?.reportData.report.fights || [];

    await getPlayersDetails({
      variables: {
        startTime,
        endTime,
        fightId,
        code,
      },
    });
  };

  const handleSelectChange = (newValue: MultiValue<Option>) => {
    setSelectedPlayers(newValue);
  };

  const handleInputChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setReportLink(value);
  };

  const options = playersDetails
    ? playerDetailsToSelectOptions(playersDetails.reportData.report.playerDetails.data.playerDetails)
    : [];

  const [{ startTime, endTime, name }] = reportFightData?.reportData.report.fights || [
    { startTime: 0, endTime: 0, name: '' },
  ];
  const { seconds } = getFightDuration(startTime, endTime, DurationUnits.Seconds);

  return (
    <div className="container">
      <a href={reportLink} target="_blank" rel="noreferrer">
        {reportLink}
      </a>
      <input className="input" placeholder="link report" value={reportLink} onChange={handleInputChange} />
      <button type="button" onClick={fetchReport}>
        Get report data
      </button>
      <span>{name}</span>
      <span>
        Fight Duration:
        {secondsToMinutesText(seconds)} m
      </span>
      <PlayersList playersDetails={playersDetails} />
      <Select value={selectedPlayers} isMulti options={options} onChange={handleSelectChange} />
      <div className="container">
        {selectedPlayers.map(({ value }) => (
          <CastsSequence
            key={value}
            playerId={value}
            fightId={fightId}
            code={code}
            startTime={startTime}
            endTime={endTime}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
