export type User = {
  username: string;
  name: string;
  id: number;
  money: number;
  tries: number;
};

export type Pot = {
  id: number;
  money: number;
  name: string;
  eligiblePlayers: Player[];
};

export type TableType = {
  id: number;
  pots: Pot[];
  openCardsImage: string[];
  prevRaise: number;
  lastMoveAmount: number;
  playerIdOfLastMove: number;
  lastMove: string;
};

export type Player = {
  id: number;
  username: string;
  money: number;
  folded: boolean;
  turn: boolean;
  cardsImage:string[];
  allIn: boolean;
  lastRaiseAmount: number;
};

export type Game = {
  id:number;
  gameFinished:boolean;
  winner:Player[];
  notFoldedPlayers:Player[];
  currentBet:number;
  smallBlindPlayer:Player;
};

