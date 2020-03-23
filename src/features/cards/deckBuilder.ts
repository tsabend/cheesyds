export class DeckBuilder {

  buildDeck(): Array<CardModel> {
    var cards: Array<CardModel> = [];

    for (const suit in Suit) {
      for (const faceValue in FaceValue) {
        const myFaceValue: FaceValue = FaceValue[faceValue] as any as FaceValue;
        if (typeof myFaceValue !== "number") continue 
        cards.push(new CardModel(suit as Suit, myFaceValue));
      }
    }

    return cards;
  }
}

export class CardModel {
  suit: Suit;
  faceValue: FaceValue;

  constructor(suit: Suit, faceValue: FaceValue) {
    this.suit = suit;
    this.faceValue = faceValue;
  }
}

export enum Suit {
  Diamonds = "Diamonds",
  Clubs    = "Clubs",
  Hearts   = "Hearts",
  Spades   = "Spades"
}

export enum FaceValue {
  Ace     = 1,
  Two     = 2,
  Three   = 3,
  Four    = 4,
  Five    = 5,
  Six     = 6,
  Seven   = 7,
  Eight   = 8,
  Nine    = 9,
  Ten     = 10,
  Jack    = 11,
  Queen   = 12,
  King    = 13
}
