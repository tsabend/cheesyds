import { Card } from "./card";
import { Deck } from "./game";
export class Player {
  name: string;
  board: PlayerBoard;

  static from(data: any): Player {
    const rawBoard = data.board;
    let board;
    if (rawBoard) {
      board = PlayerBoard.from(rawBoard);
    }
    return new Player(data.name, board);
  }

  constructor(name: string,
              board?: PlayerBoard) {
    this.name = name;
    this.board = board || new PlayerBoard();
  }

  copy(): Player {
    return new Player(this.name, this.board.copy());
  }

  isOut(): boolean {
    return this.board.isOut();
  }

  deal(cards: Card[]) {
    this.board.deal(cards);
  }

  submit(cards: Card[]) {
    this.board.submit(cards);
  }

  draw(deck: Deck) {
    // draw until you have at least 3 cards
    while (this.board.hand.length < 3 && deck.isEmpty() === false) {
      this.board.hand = this.board.hand.concat(deck.deal(1));
    }
  }

  pickUp(cards: Card[]) {
    this.board.pickUp(cards);
  }

  isEliminatingPiles(): boolean {
    return this.numberOfCards() === 0;
  }

  numberOfCards(): number {
    return this.board.hand.length;
  }
}

export class PlayerBoard {

  hand: Card[];
  piles: Card[][];
  static from(data: any): PlayerBoard {
    debugger;
    const rawHand = data.hand;
    let hand;
    if (rawHand) {
      hand = rawHand.map((card: any) => Card.from(card));
    }
    const rawPiles = data.piles;
    let piles;
    if (rawPiles) {
      piles = rawPiles.map((pile: any[]) => pile.map((card) => Card.from(card)));
    }
    return new PlayerBoard(hand, piles  );
  }
  constructor(hand?: Card[],
              piles?: Card[][]) {
                this.hand = hand || [];
                this.piles = piles || [];
  }

  copy(): PlayerBoard {
    const newPiles = this.piles.map((pile) => Array.from(pile));
    return new PlayerBoard(Array.from(this.hand), newPiles);
  }

  isOut(): boolean {
    return this.hand.length === 0 && this.piles.filter((pile) => pile.length === 0).length === 3;
  }

  // deal out an array of 6 cards
  deal(cards: Card[]) {
    const newHand = cards.splice(0, 3);
    const pile1 = cards.splice(0, 2);
    const pile2 = cards.splice(0, 2);
    const pile3 = cards.splice(0, 2);
    const newPiles = [
      pile1,
      pile2,
      pile3,
    ];
    this.hand = newHand;
    this.piles = newPiles;
  }

  submit(cards: Card[]) {
    const newHand = this.hand.filter((_card) => cards.indexOf(_card) === -1);
    const newPiles = this.piles.map((pile) => pile.filter((_card) => cards.indexOf(_card) === -1));
    this.hand = newHand;
    this.piles = newPiles;
  }

  pickUp(cards: Card[]) {
    const newHand = this.hand.concat(cards);
    this.hand = newHand;
  }
}
