import { Card } from "./card"
import { Deck } from "./game"
export class Player {
  name: string
  board: PlayerBoard

  constructor(name: string,
              board?: PlayerBoard) {
    this.name = name;
    this.board = board || new PlayerBoard();
  }

  copy(): Player {
    return new Player(this.name, this.board.copy());
  }

  deal(cards: Array<Card>) {
    this.board.deal(cards);
  }

  submit(cards: Array<Card>) {
    this.board.submit(cards);
  }

  draw(deck: Deck) {
    // draw until you have at least 3 cards
    while (this.board.hand.length < 3 && deck.isEmpty() === false) {
      this.board.hand = this.board.hand.concat(deck.deal(1));
    }
  }

  pickUp(cards: Array<Card>) {
    this.board.pickUp(cards);
  }
}

export class PlayerBoard {

  hand: Array<Card>
  piles: Array<Array<Card>>

  constructor(hand?: Array<Card>,
              piles?: Array<Array<Card>>) {
                this.hand = hand || [];
                this.piles = piles || [];
  }

  copy(): PlayerBoard {
    const newPiles = this.piles.map(pile => Array.from(pile))
    return new PlayerBoard(Array.from(this.hand), newPiles);
  }

  // deal out an array of 6 cards
  deal(cards: Array<Card>) {
    const newHand = cards.splice(0, 3);
    const pile1 = cards.splice(0, 2);
    const pile2 = cards.splice(0, 2);
    const pile3 = cards.splice(0, 2);
    const newPiles = [
      pile1,
      pile2,
      pile3
    ];
    this.hand = newHand;
    this.piles = newPiles;
  }

  submit(cards: Array<Card>) {
    const newHand = this.hand.filter(_card => cards.indexOf(_card) === -1);
    this.hand = newHand;
  }

  pickUp(cards: Array<Card>) {
    const newHand = this.hand.concat(cards);
    this.hand = newHand;
  }
}
