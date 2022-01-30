import { FC } from 'react';

import { PlayerDetails } from '../types/playerDetails';
import { FightPlayerDetails } from '../graphql/queries/fightPlayerDetails';

const PlayersList: FC<{ playersDetails?: FightPlayerDetails }> = ({ playersDetails }) => {
  if (!playersDetails) {
    return null;
  }

  const { dps, healers, tanks }: PlayerDetails = playersDetails.reportData.report.playerDetails.data.playerDetails;

  const formattedPlayers = [...tanks, ...healers, ...dps];

  return (
    <div>
      {formattedPlayers.map(({ name, id, icon }, index) => (
        <div key={id}>
          {index + 1}. | {id} | {icon} | {name}
        </div>
      ))}
    </div>
  );
};

export default PlayersList;
