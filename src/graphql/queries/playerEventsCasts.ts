import { gql } from '@apollo/client';

import { FullEvent } from '../../types/events';

export const PLAYER_EVENTS_CASTS = gql`
  query PlayerEvents($startTime: Float!, $endTime: Float!, $fightId: Int!, $code: String!, $playerId: Int!) {
    reportData {
      report(code: $code) {
        events(
          sourceID: $playerId
          fightIDs: [$fightId]
          startTime: $startTime
          endTime: $endTime
          dataType: Casts
          useAbilityIDs: false
          useActorIDs: true
          limit: 10000
        ) {
          data
          nextPageTimestamp
        }
      }
    }
  }
`;

export interface PlayerEventsCasts {
  reportData: {
    report: {
      events: {
        data: FullEvent[];
        nextPageTimestamp: number | null;
      };
    };
  };
}
