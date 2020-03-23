import { Player } from "./player"
import { Turn } from "./turn"
import {
  Suit,
  FaceValue,
  Card
} from "./card"
export class Game {
  players: Array<Player>
  deck: Deck
  currentPlayerIndex: number;
  inPlayPile: Array<Card>;

  constructor(players: Array<Player>,
              deck: Deck,
              inPlayPile: Array<Card>,
              currentPlayerIndex: number) {
    this.players = players;
    this.deck = deck;
    this.inPlayPile = inPlayPile;
    this.currentPlayerIndex = currentPlayerIndex
  }

  deal() {
    this.players.forEach(player => {
      player.deal(this.deck.deal(9));
    });
  }

  submit(cards: Array<Card>): Game {
    const newInPlayPile = this.inPlayPile.concat(cards);
    const newDeck = this.deck.copy()
    const newPlayer = this.currentPlayer().submit(cards, newDeck);
    const newPlayers = Array.from(this.players);
    newPlayers[this.currentPlayerIndex] = newPlayer;
    return new Game(newPlayers, newDeck, newInPlayPile, this.nextPlayerIndex());
  }

  pickUp(): Game {
    const newPlayer = this.currentPlayer().pickUp(this.inPlayPile);
    const newPlayers = Array.from(this.players);
    newPlayers[this.currentPlayerIndex] = newPlayer;
    return new Game(newPlayers, this.deck, [], this.nextPlayerIndex());
  }

  nextPlayerIndex(): number {
    return (this.currentPlayerIndex + 1) % this.players.length;
  }

  currentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }

  topOfInPlayPile(): Card | undefined {
    if (this.inPlayPile.length > 0) {
      return this.inPlayPile[this.inPlayPile.length - 1];
    }
    return undefined;
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

    const game = new Game(players, new Deck(), [], 0);
    game.deal();
    return game
  }
}

export class Deck {
  cards: Array<Card>
  constructor(cards?: Array<Card>) {
    const deckBuilder = new DeckBuilder();
    this.cards = cards || deckBuilder.build();
  }

  copy(): Deck {
    return new Deck(Array.from(this.cards));
  }

  isEmpty(): boolean {
    return this.cards.length === 0;
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
