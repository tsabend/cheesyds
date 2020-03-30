import { FaceValue } from "./faceValue";
import { Suit } from "./suit";

export default class Card {
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
    return "the " + this.faceName() + " of " + this.suit;
  }

  svgName(): string {
    return this.shortFaceName() + this.shortSuitName();
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
