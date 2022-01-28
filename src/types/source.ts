export enum SourceTypes {
  Paladin = 'Paladin',
}

export interface Source {
  guid: number;
  icon: string;
  id: number;
  name: string;
  server: string;
  type: SourceTypes
}
