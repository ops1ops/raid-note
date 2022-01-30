import { gql } from '@apollo/client';

import { PlayerDetails } from '../../types/playerDetails';

export const FIGHT_PLAYER_DETAILS = gql`
  query PlayerDetailsInFight($startTime: Float!, $endTime: Float!, $fightId: Int!, $code: String!) {
    reportData {
      report(code: $code) {
        playerDetails(fightIDs: [$fightId], startTime: $startTime, endTime: $endTime)
      }
    }
  }
`;

export interface FightPlayerDetails {
  reportData: {
    report: {
      playerDetails: {
        data: {
          playerDetails: PlayerDetails;
        };
      };
    };
  };
}
