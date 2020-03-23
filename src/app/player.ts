import { Card } from "./card"
export class Player {
  name: string
  board: PlayerBoard

  constructor(name: string) {
    this.name = name;
    this.board = new PlayerBoard();
  }

  deal(cards: Array<Card>) {
    this.board.deal(cards);
  }
}

export class PlayerBoard {

  hand: Array<Card>
  piles: Array<Array<Card>>

  constructor() {
    this.piles = [];
    this.hand = [];
  }

  // deal out an array of 6 cards
  deal(cards: Array<Card>) {
    this.hand = cards.splice(0, 3);
    const pile1 = cards.splice(0, 2);
    const pile2 = cards.splice(0, 2);
    const pile3 = cards.splice(0, 2);
    this.piles = [
      pile1,
      pile2,
      pile3
    ];
  }
}
