export type User = {
  username: string;
  name: string;
  id: number;
  money: number;
};

export type TableType = {
  id: number;
  money: number;
  openCardsImage: string[];
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
  winningplayer:Player;
  notFoldedPlayers:Player[];
};

