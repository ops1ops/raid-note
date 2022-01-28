import { Player } from "./player";

export type PlayerDetails = Record<'dps' | 'healers' | 'tanks', Player[]>
