import { Ability } from './ability';
import {Source} from "./source";

export enum EventTypes {
  Cast = 'cast',
  BeginCast = 'begincast',
}

interface BaseEvent {
  fight: number;
  timestamp: number;
  type: EventTypes;
}

export interface CompactEvent extends BaseEvent {
  abilityGameID: number;
  fight: number;
  sourceID: number;
}

export interface FullEvent extends BaseEvent {
  ability: Ability;
  source: Source;
}


