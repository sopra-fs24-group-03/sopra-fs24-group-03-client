export type User = {
  username: string;
  name: string;
  id: number;
  money: number;
};

export type TableType = {
  id: number;
  pot: number;
  cards: card[];
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
  card:Card;
};

