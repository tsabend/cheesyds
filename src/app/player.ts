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

  deal(cards: Array<Card>) {
    this.board = this.board.deal(cards);
  }

  submit(cards: Array<Card>, deck: Deck): Player {
    var newBoard = this.board.submit(cards);
    return new Player(this.name, newBoard);
  }

  draw(deck: Deck): Player {
    var newBoard = this.board.copy();
    // draw until you have at least 3 cards
    while (newBoard.hand.length < 3 && deck.isEmpty() === false) {
      newBoard.hand = newBoard.hand.concat(deck.deal(1));
    }
    return new Player(this.name, newBoard);
  }

  pickUp(cards: Array<Card>): Player {
    return new Player(this.name, this.board.pickUp(cards));
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
    return new PlayerBoard(this.hand, this.piles);
  }

  // deal out an array of 6 cards
  deal(cards: Array<Card>): PlayerBoard {
    const newHand = cards.splice(0, 3);
    const pile1 = cards.splice(0, 2);
    const pile2 = cards.splice(0, 2);
    const pile3 = cards.splice(0, 2);
    const newPiles = [
      pile1,
      pile2,
      pile3
    ];
    return new PlayerBoard(newHand, newPiles)
  }

  submit(cards: Array<Card>): PlayerBoard {
    const newHand = this.hand.filter(_card => cards.indexOf(_card) === -1);
    return new PlayerBoard(newHand, this.piles);
  }

  pickUp(cards: Array<Card>): PlayerBoard {
    const newHand = this.hand.concat(cards);
    return new PlayerBoard(newHand, this.piles);
  }
}
