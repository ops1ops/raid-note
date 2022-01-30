import { Fight } from './fight';
import { FullEvent } from './events';
import { PlayerDetails } from './playerDetails';

export interface Report {
  fight: Fight;
  events: {
    data: FullEvent[];
    nextPageTimestamp: null | number;
  };
  playerDetails: PlayerDetails;
}

export interface ReportData {
  report: Report;
}
