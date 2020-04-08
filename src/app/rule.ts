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
export function getRule(cards: Card[], inPlayPile: Card[]): Rule {
  const faceValue = cards[0].faceValue;
  const length = cards.length;
  if (length >= 4 || faceValue === FaceValue.Ten) return Rule.Clear;
  if (length === 3 && topNMatch(1, faceValue, inPlayPile)) return Rule.Clear;
  if (length === 2 && topNMatch(2, faceValue, inPlayPile)) return Rule.Clear;
  if (length === 1 && topNMatch(3, faceValue, inPlayPile)) return Rule.Clear;
  if (length >= 3 && faceValue === FaceValue.Six) return Rule.ForcePickUp;
  if (faceValue === FaceValue.Eight && length === 1) return Rule.SkipOne;
  if (faceValue === FaceValue.Eight && length === 2) return Rule.SkipTwo;
  if (faceValue === FaceValue.Eight && length === 3) return Rule.SkipThree;
  if (faceValue === FaceValue.Seven) return Rule.ReverseForOneTurn;
  return Rule.Play;
}

function topNMatch(n: number, faceValue: FaceValue, inPlayPile: Card[]): boolean {
  if (n > inPlayPile.length) return false;
  for (let i = inPlayPile.length - 1; i >= inPlayPile.length - n; i--) {
      if (inPlayPile[i].faceValue !== faceValue) return false;
  }
  return true;
}

export function canPlay(faceValue: FaceValue, onFaceValue?: FaceValue): boolean {
  if (!onFaceValue) return true;
  const isInReverse = onFaceValue === FaceValue.Seven;
  if (isWild(faceValue)) return true;
  return isInReverse ? faceValue <= onFaceValue : faceValue >= onFaceValue;
}

function isWild(faceValue: FaceValue): boolean {
  return faceValue === FaceValue.Ten || faceValue === FaceValue.Two;
}
