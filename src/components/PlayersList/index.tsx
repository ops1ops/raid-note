import { FC, useState } from 'react';
import classNames from 'classnames';

import { FightPlayerDetails } from '../../graphql/queries/fightPlayerDetails';
import './styles.scss';
import { Player, PlayerDetails } from '../../types/player';
import Button from '../Button';

interface PlayersListProps {
  playersDetails?: FightPlayerDetails;
  onSubmit: (players: Player[]) => void;
}

const createListFilter =
  <T extends { id: number }>(item: T) =>
  (items: T[]) => {
    const existingIdIndex = items.findIndex(({ id }) => id === item.id);

    if (existingIdIndex > -1) {
      const newItems = [...items];

      newItems.splice(existingIdIndex, 1);

      return newItems;
    }

    return [...items, item];
  };

const PlayersList: FC<PlayersListProps> = ({ playersDetails, onSubmit }) => {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  if (!playersDetails) {
    return null;
  }

  const createClickHandler = (player: Player) => () => {
    setSelectedPlayers(createListFilter(player));
  };

  const handleSubmit = () => {
    onSubmit(selectedPlayers);
  };

  const { dps, healers, tanks }: PlayerDetails = playersDetails.reportData.report.playerDetails.data.playerDetails;

  const formattedPlayers = [...tanks, ...healers, ...dps];

  return (
    <div className="players-list-container">
      <div className="players-list">
        {formattedPlayers.map((player, index) => {
          const { name, id, icon, type } = player;
          const isPlayerSelected = selectedPlayers.some(({ id: playerId }) => playerId === id);

          return (
            <div
              role="presentation"
              key={id}
              onClick={createClickHandler(player)}
              className={classNames('players-list__item', {
                'players-list__item--selected': isPlayerSelected,
              })}
            >
              <span className="players-list__position">{index + 1}.</span>
              <span className={type}>{name}</span>
              <span className="players-list__class">({icon})</span>
            </div>
          );
        })}
      </div>
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default PlayersList;
