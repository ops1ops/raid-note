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
          useActorIDs: false
          limit: 10000
        ) {
          data
          nextPageTimestamp
        }
      }
    }
  }
`;

export const getPlayersEventsCastsQuery = (playersId: number[]) => {
  const reportDataQueries = playersId.reduce(
    (accumulator, id) =>
      `${accumulator}
      reportData${id}: reportData {
        report(code: $code) {
          events(
            sourceID: ${id}
            fightIDs: [$fightId]
            startTime: $startTime
            endTime: $endTime
            dataType: Casts
            useAbilityIDs: false
            useActorIDs: false
            limit: 10000
          ) {
            data
            nextPageTimestamp
          }
        }
      }`,
    '',
  );

  return gql`
    query PlayerEvents($startTime: Float!, $endTime: Float!, $fightId: Int!, $code: String!) {
      ${reportDataQueries}
    }
  `;
};

interface ReportData {
  report: {
    events: {
      data: FullEvent[];
      nextPageTimestamp: number | null;
    };
  };
}

export interface PlayersEventsCasts {
  [playerReportData: string]: ReportData;
}
