import { useLazyQuery } from '@apollo/client';
import { ChangeEvent, useState } from 'react';

import PlayersList from './components/PlayersList';
import { parseReportUrl } from './utils/parseReportUrl';
import CastsSequence from './components/CastsSequence';
import { DurationUnits, getFightDuration } from './utils/getFightDuration';
import { secondsToMinutesText } from './utils/formatters';
import { REPORT_FIGHT, ReportFight } from './graphql/queries/reportFight';
import { FIGHT_PLAYER_DETAILS, FightPlayerDetails } from './graphql/queries/fightPlayerDetails';
import './App.scss';
import Button from './components/Button';

const DEFAULT_REPORT_LINK = 'https://www.warcraftlogs.com/reports/WMv4Jz92HK3Z8raD#fight=5';

const App = () => {
  const [reportLink, setReportLink] = useState(DEFAULT_REPORT_LINK);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);

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

  const handlePlayerClick = (newId: number) => {
    setSelectedPlayers((prevSelectedPlayersIds) =>
      prevSelectedPlayersIds.includes(newId)
        ? prevSelectedPlayersIds.filter((id) => id !== newId)
        : [...prevSelectedPlayersIds, newId],
    );
  };

  const handleInputChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setReportLink(value);
  };

  const [{ startTime, endTime, name }] = reportFightData?.reportData.report.fights || [
    { startTime: 0, endTime: 0, name: '' },
  ];
  const { seconds } = getFightDuration(startTime, endTime, DurationUnits.Seconds);

  return (
    <>
      <main>
        <a href={reportLink} target="_blank" rel="noreferrer">
          {reportLink}
        </a>
        <input className="input" placeholder="link report" value={reportLink} onChange={handleInputChange} />
        <Button type="button" onClick={fetchReport}>
          Get report data
        </Button>
        <span>{name}</span>
        <div>
          <span>Fight Duration: </span>
          <span>{secondsToMinutesText(seconds)} m</span>
        </div>
        <div className="main-block">
          <PlayersList selectedPlayers={selectedPlayers} onClick={handlePlayerClick} playersDetails={playersDetails} />
          <div className="casts">
            {selectedPlayers.map((id) => (
              <CastsSequence
                key={id}
                playerId={id}
                fightId={fightId}
                bossName={name}
                code={code}
                startTime={startTime}
                endTime={endTime}
              />
            ))}
          </div>
        </div>
      </main>
      <footer>
        All data is retrieved from Warcraft Logs. Item and ability tooltips by Wowhead. All images copyright Blizzard
        Entertainment. World of Warcraft Warcraft and Blizzard Entertainment are trademarks or registered trademarks of
        Blizzard Entertainment, Inc. in the U.S. and/or other countries.
      </footer>
    </>
  );
};

export default App;
