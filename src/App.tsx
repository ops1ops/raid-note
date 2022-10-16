import { useLazyQuery } from '@apollo/client';
import { ChangeEvent, useState } from 'react';

import PlayersList from './components/PlayersList';
import { parseReportUrl } from './utils/parseReportUrl';
import Casts from './components/Casts';
import { DurationUnits, getFightDuration } from './utils/getFightDuration';
import { secondsToMinutesText } from './utils/formatters';
import { REPORT_FIGHT, ReportFight } from './graphql/queries/reportFight';
import { FIGHT_PLAYER_DETAILS, FightPlayerDetails } from './graphql/queries/fightPlayerDetails';
import './App.scss';
import Button from './components/Button';
import Settings from './components/Settings';
import SettingsProvider from './components/context/SettingsProvider';
import { Player } from './types/player';

const DEFAULT_REPORT_LINK = 'https://www.warcraftlogs.com/reports/Nhqa36MwY8mjcbrX#fight=41';

const App = () => {
  const [reportLink, setReportLink] = useState(DEFAULT_REPORT_LINK);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  const [getReportFight, { loading: reportFightLoading, data: reportFightData }] =
    useLazyQuery<ReportFight>(REPORT_FIGHT);
  const [getPlayersDetails, { data: playersDetails, loading: playersDetailsLoading }] =
    useLazyQuery<FightPlayerDetails>(FIGHT_PLAYER_DETAILS);

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

  const handleInputChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setReportLink(value);
  };

  const [{ startTime, endTime, name }] = reportFightData?.reportData.report.fights || [
    { startTime: 0, endTime: 0, name: '' },
  ];
  const { seconds } = getFightDuration(startTime, endTime, DurationUnits.Seconds);

  const isLoading = playersDetailsLoading || reportFightLoading;

  return (
    <SettingsProvider>
      <main>
        <header>
          <div className="container">
            <a href={reportLink} target="_blank" rel="noreferrer">
              {reportLink}
            </a>
            <input className="input" placeholder="link report" value={reportLink} onChange={handleInputChange} />
            <Button type="button" onClick={fetchReport}>
              Get report data
            </Button>
            {isLoading && <span>Loading...</span>}
            {name && (
              <div className="fight-info">
                <span>{name}</span>
                <span>|</span>
                <span>Fight duration: {secondsToMinutesText(seconds)} m</span>
              </div>
            )}
          </div>
          <Settings />
        </header>
        <div className="main-block">
          <PlayersList onSubmit={setSelectedPlayers} playersDetails={playersDetails} />
          <div className="casts-container">
            {selectedPlayers.length > 0 && (
              <Casts
                players={selectedPlayers}
                fightId={fightId}
                bossName={name}
                code={code}
                startTime={startTime}
                endTime={endTime}
              />
            )}
          </div>
        </div>
      </main>
      <footer>
        All data is retrieved from Warcraft Logs. Item and ability tooltips by Wowhead. All images copyright Blizzard
        Entertainment. World of Warcraft Warcraft and Blizzard Entertainment are trademarks or registered trademarks of
        Blizzard Entertainment, Inc. in the U.S. and/or other countries.
      </footer>
    </SettingsProvider>
  );
};

export default App;
