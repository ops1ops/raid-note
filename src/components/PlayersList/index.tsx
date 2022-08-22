import { FC } from 'react';
import classNames from 'classnames';

import { PlayerDetails } from '../../types/playerDetails';
import { FightPlayerDetails } from '../../graphql/queries/fightPlayerDetails';
import './styles.scss';

interface PlayersListProps {
  selectedPlayers: number[];
  onClick: (id: number) => void;
  playersDetails?: FightPlayerDetails;
}

const PlayersList: FC<PlayersListProps> = ({ playersDetails, onClick, selectedPlayers }) => {
  if (!playersDetails) {
    return null;
  }

  const createClickHandler = (id: number) => () => {
    onClick(id);
  };

  const { dps, healers, tanks }: PlayerDetails = playersDetails.reportData.report.playerDetails.data.playerDetails;

  const formattedPlayers = [...tanks, ...healers, ...dps];

  return (
    <div className="players-list">
      {formattedPlayers.map(({ name, id, icon }, index) => (
        <div
          role="presentation"
          key={id}
          onClick={createClickHandler(id)}
          className={classNames('players-list__item', { 'players-list__item--selected': selectedPlayers.includes(id) })}
        >
          {index + 1}. {icon} | {name}
        </div>
      ))}
    </div>
  );
};

export default PlayersList;
