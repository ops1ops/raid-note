import { FC } from 'react';
import classNames from 'classnames';

import { PlayerDetails } from '../../types/playerDetails';
import { FightPlayerDetails } from '../../graphql/queries/fightPlayerDetails';
import './styles.scss';
import { Player } from '../../types/player';

interface PlayersListProps {
  selectedPlayers: Player[];
  onClick: (player: Player) => void;
  playersDetails?: FightPlayerDetails;
}

const PlayersList: FC<PlayersListProps> = ({ playersDetails, onClick, selectedPlayers }) => {
  if (!playersDetails) {
    return null;
  }

  const createClickHandler = (player: Player) => () => {
    onClick(player);
  };

  const { dps, healers, tanks }: PlayerDetails = playersDetails.reportData.report.playerDetails.data.playerDetails;

  const formattedPlayers = [...tanks, ...healers, ...dps];

  return (
    <div className="players-list">
      {formattedPlayers.map((player, index) => {
        const { name, id, icon } = player;

        return (
          <div
            role="presentation"
            key={id}
            onClick={createClickHandler(player)}
            className={classNames('players-list__item', {
              'players-list__item--selected': selectedPlayers.find(({ id: playerId }) => playerId === id),
            })}
          >
            <span className="players-list__position">{index + 1}.</span>
            {name}
            <span className="players-list__class">({icon})</span>
          </div>
        );
      })}
    </div>
  );
};

export default PlayersList;
