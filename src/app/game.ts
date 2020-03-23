import { Player } from "./player"
import { Turn } from "./turn"
import {
  Suit,
  FaceValue,
  Card,
  Rule,
  getRule
} from "./card"

export class GameSnapshot {
  players: Array<Player>
  deck: Deck
  currentPlayerIndex: number;
  inPlayPile: Array<Card>;
  isInReverse: boolean

  constructor(players: Array<Player>,
              deck: Deck,
              inPlayPile: Array<Card>,
              currentPlayerIndex: number,
              isInReverse: boolean
            ) {
    this.players = players;
    this.deck = deck;
    this.inPlayPile = inPlayPile;
    this.currentPlayerIndex = currentPlayerIndex;
    this.isInReverse = isInReverse;
  }

  copy(): GameSnapshot {
    return new GameSnapshot(
      Array.from(this.players.map(player => player.copy())),
      this.deck.copy(),
      Array.from(this.inPlayPile),
      this.currentPlayerIndex,
      this.isInReverse
    );
  }

  nextPlayerIndex(): number {
    return this.playerIndexSkipping(1);
  }

  playerIndexSkipping(n: number): number {
    return (this.currentPlayerIndex + n) % this.players.length;
  }

  currentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }

  nextPlayer(): Player {
    return this.players[this.nextPlayerIndex()];
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

export class GameController {
  deal(snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, snapshot => {
      snapshot.players.forEach((player: Player) => {
        player.deal(snapshot.deck.deal(9));
      });
    });
  }

  mutate(snapshot: GameSnapshot, mutation: (snapshot: GameSnapshot) => void): GameSnapshot {
    const copy = snapshot.copy()
    mutation(copy);
    return copy
  }

  submit(cards: Array<Card>, snapshot: GameSnapshot): GameSnapshot {
    switch (getRule(cards)) {
      case Rule.Play:
      return this.play(cards, snapshot);
      case Rule.Clear:
      return this.clear(cards, snapshot);
      case Rule.ForcePickUp:
      return this.forcePickUp(cards, snapshot);
      case Rule.ReverseForOneTurn:
      return this.reverse(cards, snapshot)
      case Rule.SkipOne:
      return this.skip(1, cards, snapshot);
      case Rule.SkipTwo:
      return this.skip(2, cards, snapshot);
      case Rule.SkipThree:
      return this.skip(3, cards, snapshot);
      default:
      return this.play(cards, snapshot);
    }
  }

  play(cards: Array<Card>, snapshot: GameSnapshot): GameSnapshot {
    return this._play(cards, false, snapshot);
  }

  reverse(cards: Array<Card>, snapshot: GameSnapshot): GameSnapshot {
    return this._play(cards, true, snapshot);
  }

  _play(cards: Array<Card>, willReverse: boolean, snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, snapshot => {
      snapshot.currentPlayer().submit(cards);
      snapshot.currentPlayer().draw(snapshot.deck);
      snapshot.inPlayPile = snapshot.inPlayPile.concat(cards);
      snapshot.currentPlayerIndex = snapshot.nextPlayerIndex()
      snapshot.isInReverse = willReverse;
    });
  }

  clear(cards: Array<Card>, snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, snapshot => {
      snapshot.currentPlayer().submit(cards);
      snapshot.currentPlayer().draw(snapshot.deck);
      snapshot.inPlayPile = [];
      snapshot.currentPlayerIndex = snapshot.nextPlayerIndex()
    });
  }

  forcePickUp(cards: Array<Card>, snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, snapshot => {
      snapshot.currentPlayer().submit(cards);
      snapshot.currentPlayer().draw(snapshot.deck);
      snapshot.nextPlayer().pickUp(snapshot.inPlayPile);
      snapshot.inPlayPile = [];
      snapshot.currentPlayerIndex = snapshot.playerIndexSkipping(2);
    });
  }

  skip(skipCount: number, cards: Array<Card>, snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, snapshot => {
      snapshot.currentPlayer().submit(cards);
      snapshot.currentPlayer().draw(snapshot.deck);
      snapshot.inPlayPile = snapshot.inPlayPile.concat(cards);
      snapshot.currentPlayerIndex = snapshot.playerIndexSkipping(skipCount + 1);
    });
  }

  pickUp(snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, snapshot => {
      snapshot.currentPlayer().pickUp(snapshot.inPlayPile);
      snapshot.inPlayPile = [];
      snapshot.currentPlayerIndex = snapshot.nextPlayerIndex();
    });
  }
}

export class GameBuilder {
  makeFakeGame(): GameSnapshot {
    const players = [
      new Player("Thomas"),
      new Player("Monica"),
      new Player("Jojo")
    ];

    return new GameSnapshot(players, new Deck(), [], 0, false);
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
