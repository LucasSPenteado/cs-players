export type Player = {
  id: number;
  name: string;
  nickName: string;
  age: number;
  currentTeam?: string;
};

export type Achievements = {
  major: number;
  eslProLeague: number;
  blast: number;
  dreamhack: number;
  iem: number;
  playerId: number;
};
