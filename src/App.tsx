import {gql, useLazyQuery} from "@apollo/client";
import {ChangeEvent, useState} from "react";
import Select from 'react-select'

import './App.scss';
import PlayersList from "./components/PlayersList";
import {parseReportUrl} from "./utils/parseReportUrl";
import Timeline from "./components/Timeline";
import {PlayerDetails} from "./types/playerDetails";

const REPORT_FIGHT = gql`
  query ReportFight($code: String!, $fightId: Int!) {
    reportData {
      report(code: $code) {
        fights(fightIDs: [$fightId]) {
          averageItemLevel,
          encounterID,
          friendlyPlayers,
          name,
          id,
          endTime,
          startTime
        }
      }
    }
  }
`

const PLAYERS_DETAILS = gql`
  query PlayersDataInFight($startTime: Float!, $endTime: Float!, $fightId: Int!, $code: String!) {
    reportData {
      report(code: $code) {
        events(fightIDs: [$fightId], startTime: $startTime, endTime: $endTime, dataType: Casts, useAbilityIDs: false, useActorIDs: true, limit: 1000) {
          data
        }
        playerDetails(fightIDs: [$fightId], startTime: $startTime, endTime: $endTime)
      }
    }
  }
`

const DEFAULT_REPORT_LINK = 'https://www.warcraftlogs.com/reports/WMv4Jz92HK3Z8raD#fight=30&type=healing';

const playerDetailsToPlayers = ({ tanks, healers, dps }: PlayerDetails) => [...tanks, ...healers, ...dps];

const toSelectOptions = (playerDetails: PlayerDetails) => {
  const players = playerDetailsToPlayers(playerDetails);

  return players.map(({ id, name }) => ({
    value: id,
    label: name,
  }))
};

interface Option {
  value: number;
  label: string;
}

const App = () => {
  const [reportLink, setReportLink] = useState(DEFAULT_REPORT_LINK);
  const [selectedPlayers, setSelectedPlayers] = useState<Option[]>([]);

  const [getReportFight, { loading: reportFightLoading, data: reportFightData }] = useLazyQuery(REPORT_FIGHT);
  const [getPlayersDetails, { data: playersDetails, loading: playersDetailsLoading }] = useLazyQuery(PLAYERS_DETAILS);

  const handleChange = ({ target: { value }}: ChangeEvent<HTMLInputElement>) => {
    setReportLink(value);
  };

  const { fightId, code } = parseReportUrl(reportLink);

  const handleClick = async () => {
    const { data } = await getReportFight({ variables: { fightId, code } });
    const [{ startTime, endTime }] = data.reportData.report.fights;

    await getPlayersDetails({ variables: { startTime, endTime, fightId, code } })
  };

  if (playersDetailsLoading || reportFightLoading) {
    return <span>Loading...</span>
  }

  const options = playersDetails ? toSelectOptions(playersDetails.reportData.report.playerDetails.data.playerDetails) : [];

  const { startTime, endTime } = reportFightData ? reportFightData.reportData.report.fights[0] : { startTime: 0, endTime: 0 };

  const handleSelectChange = (newValue: any) => {
    setSelectedPlayers(newValue);
  }

  return (
    <div className="container">
      URL: {reportLink}
      <input className="input" placeholder="link report" value={reportLink} onChange={handleChange} />
      <button onClick={handleClick}>Fetch report data</button>
      <PlayersList playersDetails={playersDetails} />
      <Select value={selectedPlayers} isMulti options={options} onChange={handleSelectChange} />
      <div className="container">
        {selectedPlayers.map(({ value }) =>
          <Timeline playerId={value} fightId={fightId} code={code} startTime={startTime} endTime={endTime} />
        )}
      </div>
    </div>
  );
}

export default App;
