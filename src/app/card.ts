export class Card {
  suit: Suit;
  faceValue: FaceValue;

  static from(data: any): Card {
    return new Card(data.suit, data.faceValue);
  }

  constructor(suit: Suit, faceValue: FaceValue) {
    this.suit = suit;
    this.faceValue = faceValue;
  }

  index(): string {
    return this.suit + this.faceValue;
  }

  svgName(): string {
    return this.shortFaceName() + this.shortSuitName()
  }

  className(): string {
    return this.suitClassName() + "_" + this.faceClassName();
  }

  faceClassName(): string {
    return this.suit.toLowerCase();
  }

  suitClassName(): string {
    switch (this.faceValue) {
      case FaceValue.Two: return "two";
      case FaceValue.Three: return "three";
      case FaceValue.Four: return "four";
      case FaceValue.Five: return "five";
      case FaceValue.Six: return "six";
      case FaceValue.Seven: return "seven";
      case FaceValue.Eight: return "eight";
      case FaceValue.Nine: return "nine";
      case FaceValue.Ten: return "ten";
      case FaceValue.Jack: return "jack";
      case FaceValue.Queen: return "queen";
      case FaceValue.King: return "king";
      case FaceValue.Ace: return "ace";
    }
  }

  shortSuitName(): string {
    return this.suit.charAt(0);
  }

  shortFaceName(): string {
    switch (this.faceValue) {
      case FaceValue.Jack: return "J";
      case FaceValue.Queen: return "Q";
      case FaceValue.King: return "K";
      case FaceValue.Ace: return "A";
      default: return this.faceValue + "";
    }
  }
}

export enum Suit {
  Diamonds = "Diamonds",
  Clubs    = "Clubs",
  Hearts   = "Hearts",
  Spades   = "Spades",
}

export enum FaceValue {
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
  King    = 13,
  Ace     = 14,
}

export enum Rule {
  Play,
  Clear,
  ForcePickUp,
  ReverseForOneTurn,
  SkipOne,
  SkipTwo,
  SkipThree,
}

// assumes array is non-null and the cards are all the same faceValue
export function getRule(cards: Card[]): Rule {
  const faceValue = cards[0].faceValue;
  const length = cards.length;
  if (length === 4 || faceValue === FaceValue.Ten) return Rule.Clear;
  if (length >= 3 && faceValue === FaceValue.Six) return Rule.ForcePickUp;
  if (faceValue === FaceValue.Eight && length === 1) return Rule.SkipOne;
  if (faceValue === FaceValue.Eight && length === 2) return Rule.SkipTwo;
  if (faceValue === FaceValue.Eight && length === 3) return Rule.SkipThree;
  if (faceValue === FaceValue.Seven) return Rule.ReverseForOneTurn;
  return Rule.Play;
}

export function canPlayOn(faceValue: FaceValue, onFaceValue: FaceValue, isInReverse: boolean): boolean {
  if (isWild(faceValue)) return true;
  return isInReverse ? faceValue <= onFaceValue : faceValue >= onFaceValue;
}

function isWild(faceValue: FaceValue): boolean {
  return faceValue === FaceValue.Ten || faceValue === FaceValue.Two;
}
