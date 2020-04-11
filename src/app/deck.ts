import Card from "./card";
import { FaceValue } from "./faceValue";
import { Suit } from "./suit";
import { shuffle } from "./utility";

export class Deck {
  cards: Card[];
  static from(data: any): Deck {
    if (data) {
      return new Deck(data.cards.map((cardData: any) => Card.from(cardData)));
    }
    return new Deck([]);
  }

  static makeDeck(playerCount: number): Deck {
    const numberOfDecks = playerCount > 4 ? 2 : 1
    const deckBuilder = new DeckBuilder();
    var cards: Card[] = []
    for (let i = 0; i < numberOfDecks; i++) {
      cards = cards.concat(deckBuilder.build(i + 1));
    }
    return new Deck(cards);
  }

  constructor(cards?: Card[]) {
    const deckBuilder = new DeckBuilder();
    this.cards = cards || deckBuilder.build(1);
  }

  copy(): Deck {
    return new Deck(Array.from(this.cards));
  }

  isEmpty(): boolean {
    return this.cards.length === 0;
  }

  deal(numberOfCards: number): Card[] {
    let out: Card[] = [];
    for (let index = 0; index < numberOfCards; index++) {
      let last = this.cards.pop() as Card;
      if (last) out.push(last);
    }
    return out;
  }
}

export class DeckBuilder {
  build(idSeed: number): Card[] {
    let cards: Card[] = [];

    var idx = 0;
    for (const suit in Suit) {
      for (const faceValue in FaceValue) {
        const myFaceValue: FaceValue = FaceValue[faceValue] as any as FaceValue;
        if (typeof myFaceValue !== "number") continue;
        cards.push(new Card(suit as Suit, myFaceValue, idx * idSeed));
        idx++;
      }
    }
    // mutating shuffle
    shuffle(cards);

    return cards;
  }

}
