import { PlayerDetails } from '../types/playerDetails';

export const playerDetailsToPlayers = ({ tanks, healers, dps }: PlayerDetails) => [...tanks, ...healers, ...dps];

export const playerDetailsToSelectOptions = (playerDetails: PlayerDetails) => {
  const players = playerDetailsToPlayers(playerDetails);

  return players.map(({ id, name, specs: [{ spec }] }) => ({
    value: id,
    label: `${name} (${spec})`,
  }));
};
