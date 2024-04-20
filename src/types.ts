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

export type Card = {
  code:string;
  image:string
};

export type Player = {
  username: string;
  name: string;
  id: number;
  money: number;
  folded: boolean;
  turn: boolean;
  cardsImage:string[];
};

