import Card from "./card"
import { FaceValue } from "./faceValue"

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
