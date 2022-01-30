import { Spec } from './spec';

export interface Player {
  guid: number;
  icon: string;
  id: number;
  maxItemLevel: number;
  minItemLevel: number;
  name: string;
  server: string;
  specs: Spec[];
}
