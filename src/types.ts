export type User = {
  username: string;
  name: string;
  id: number;
  money: number;
  tries: number;
};

export type TableType = {
  id: number;
  money: number;
  openCardsImage: string[];
  prevRaise: number;
  lastMoveAmount: number;
  playerIdOfLastMove: string;
  lastMove: string;
};

export type Player = {
  id: number;
  username: string;
  money: number;
  folded: boolean;
  turn: boolean;
  cardsImage:string[];
};

export type Game = {
  id:number;
  gameFinished:boolean;
  winner:Player[];
  notFoldedPlayers:Player[];
};

