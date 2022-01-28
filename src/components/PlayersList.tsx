import { PlayerDetails } from "../types/playerDetails";

const PlayersList = ({ playersDetails }: any) => {
  if (!playersDetails) {
    return null;
  }

  const { dps, healers, tanks }: PlayerDetails = playersDetails.reportData.report.playerDetails.data.playerDetails;

  const formattedPlayers = [...tanks, ...healers, ...dps];

  return (
    <div>
      {formattedPlayers.map(({ name, id, icon }, index) => (
        <div>
          {index + 1}. | {id} | {icon} | {name}
        </div>
      ))}
    </div>
  )
}

export default PlayersList;
