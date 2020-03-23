import { Player } from "./player"
import {
  Suit,
  FaceValue,
  Card
} from "./card"
export class Game {
  players: Array<Player>
  deck: Deck
  currentPlayerIndex: number;

  constructor(players: Array<Player>,
              deck: Deck,
              currentPlayerIndex: number) {
    this.players = players;
    this.deck = deck;
    this.currentPlayerIndex = currentPlayerIndex
  }

  deal() {
    this.players.forEach(player => {
      player.deal(this.deck.deal(9));
    });
  }

  submit(): Game {
    return new Game(this.players, this.deck, this.nextPlayerIndex());
  }

  nextPlayerIndex(): number {
    return (this.currentPlayerIndex + 1) % this.players.length;
  }

  isCurrentPlayer(player: Player): boolean {
    return this.players[this.currentPlayerIndex] === player;
  }
}

export class GameBuilder {
  makeFakeGame(): Game {
    const players = [
      new Player("Thomas"),
      new Player("Monica"),
      new Player("Jojo")
    ];

    const game = new Game(players, new Deck(), 0);
    game.deal();
    return game
  }
}

export class Deck {
  cards: Array<Card>
  constructor() {
    const deckBuilder = new DeckBuilder();
    this.cards = deckBuilder.build();
  }

  deal(numberOfCards: number): Array<Card> {
    var out: Array<Card> = [];
    for (let index = 0; index < numberOfCards; index++) {
      var last = this.cards.pop() as Card;
      out.push(last);
    }
    return out;
  }
}

export class DeckBuilder {
  build(): Array<Card> {
    var cards: Array<Card> = [];

    for (const suit in Suit) {
      for (const faceValue in FaceValue) {
        const myFaceValue: FaceValue = FaceValue[faceValue] as any as FaceValue;
        if (typeof myFaceValue !== "number") continue;
        cards.push(new Card(suit as Suit, myFaceValue));
      }
    }
    // mutating shuffle
    this.shuffle(cards);

    return cards;
  }

  shuffle(array: Array<Card>) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
