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

  constructor(players: Array<Player>,
              deck: Deck,
              inPlayPile: Array<Card>,
              currentPlayerIndex: number) {
    this.players = players;
    this.deck = deck;
    this.inPlayPile = inPlayPile;
    this.currentPlayerIndex = currentPlayerIndex
  }

  copy(): GameSnapshot {
    return new GameSnapshot(
      Array.from(this.players),
      this.deck.copy(),
      Array.from(this.inPlayPile),
      this.currentPlayerIndex
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
  deal(snapshot): GameSnapshot {
    return this.mutate(snapshot => {
      snapshot.players.forEach((player: Player) => {
        player.deal(snapshot.deck.deal(9));
      });
    });
  }

  mutate(mutation: (snapshot: GameSnapshot) => void): GameSnapshot {
    const copy = this.snapshot.copy()
    mutation(copy);
    return copy
  }

  submit(cards: Array<Card>, snapshot: GameSnapshot): Game {
    switch (getRule(cards)) {
      case Rule.Play:
      return this.play(cards, snapshot);
      case Rule.Clear:
      return this.clear(cards, snapshot);
      case Rule.ForcePickUp:
      return this.forcePickUp(cards, snapshot);
      // case Rule.ReverseForOneTurn:
      // break;
      // case Rule.SkipOne:
      // break;
      // case Rule.SkipTwo:
      // break;
      // case Rule.SkipThree:
      // break;
      default:
      return this.play(cards, snapshot);
    }
  }

  play(cards: Array<Card>): GameSnapshot {
    return this.mutate(snapshot => {
      const newInPlayPile = snapshot.inPlayPile.concat(cards);

      const newPlayer = snapshot.currentPlayer().submit(cards, newDeck);
      const newPlayers = snapshot.replacePlayer(newPlayer);
      return new GameSnapshot(newPlayers, newDeck, newInPlayPile, this.nextPlayerIndex());
    });
  }

  clear(cards: Array<Card>): GameSnapshot {
    const newInPlayPile = snapshot.inPlayPile.concat(cards);
    const newDeck = snapshot.deck.copy()
    const newPlayer = snapshot.currentPlayer().submit(cards, newDeck);
    const newPlayers = snapshot.replacePlayer(newPlayer)
    return new Game(newPlayers, newDeck, [], this.nextPlayerIndex());
  }

  forcePickUp(cards: Array<Card>): GameSnapshot {
    const newVictim = this.nextPlayer().pickUp(this.inPlayPile);
    const newPlayers = this.replacePlayer(newVictim)
    return new Game(newPlayers, this.deck, [], this.playerIndexSkipping(2));
  }

  skip(): GameSnapshot {

  }

  pickUp(): GameSnapshot {
    const newPlayer = this.currentPlayer().pickUp(this.inPlayPile);
    const newPlayers = this.replacePlayer(newPlayer)
    return new Game(newPlayers, this.deck, [], this.nextPlayerIndex());
  }

  replacePlayer(relacement: Player): Array<Player> {
    const newPlayers = Array.from(this.players);
    const index = newPlayers.firstIndex(player => player.name === relacement.name)
    newPlayers[index] = relacement;
    return newPlayers;
  }

}

export class GameBuilder {
  makeFakeGame(): GameSnapshot {
    const players = [
      new Player("Thomas"),
      new Player("Monica"),
      new Player("Jojo")
    ];

    return new GameSnapshot(players, new Deck(), [], 0);
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
