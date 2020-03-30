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

  userFacingName(): string {
    return "the " + this.faceName() + " of " + this.suit
  }

  svgName(): string {
    return this.shortFaceName() + this.shortSuitName()
  }

  faceName(): string {
    switch (this.faceValue) {
      case FaceValue.Two: return "Two";
      case FaceValue.Three: return "Three";
      case FaceValue.Four: return "Four";
      case FaceValue.Five: return "Five";
      case FaceValue.Six: return "Six";
      case FaceValue.Seven: return "Seven";
      case FaceValue.Eight: return "Eight";
      case FaceValue.Nine: return "Nine";
      case FaceValue.Ten: return "Ten";
      case FaceValue.Jack: return "Jack";
      case FaceValue.Queen: return "Queen";
      case FaceValue.King: return "King";
      case FaceValue.Ace: return "Ace";
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
