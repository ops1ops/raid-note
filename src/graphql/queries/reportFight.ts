import { gql } from '@apollo/client';

import { Fight } from '../../types/fight';

export const REPORT_FIGHT = gql`
  query ReportFight($code: String!, $fightId: Int!) {
    reportData {
      report(code: $code) {
        fights(fightIDs: [$fightId]) {
          name
          endTime
          startTime
        }
      }
    }
  }
`;

export interface ReportFight {
  reportData: {
    report: {
      fights: Pick<Fight, 'endTime' | 'startTime' | 'name'>[];
    };
  };
}
