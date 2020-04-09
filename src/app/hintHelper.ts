import Card from "./card";
import { sample } from "./utility";
import { FaceValue } from "./faceValue";

export const generatePlayHint = (playerName: string, skipCount: number, cards: Card[]): string => {
    if (cards[0].faceValue === FaceValue.Two) {
      return "Deuces wild. " +
             playerName +
             " just " +
             wordForPlayed() +
             wordForNumber(cards.length) +
             "Twos. Start this party back at square one.";
    }
    const playText = playerName +
    wordForPlayed() +
    formattedCards(cards) +
    ".";
    if (cards[0] && cards[0].faceValue === FaceValue.Seven) {
      return playText + generateReverseHint();
    }
    else if (skipCount > 0) {
      return playText + generateSkipHint(cards);
    }
    else {
      return playText;
    }
}

const wordForNumber = (number: number): string => {
  if (number === 1) return " one ";
  if (number === 2) return " two ";
  if (number === 3) return " three ";
  if (number === 4) return " four ";
  return " a whole mess of ";
}

export const formattedCards = (cards: Card[]): string => {
  if (cards.length === 1) return " " + cards[0].userFacingName();
  return wordForNumber(cards.length) + cards[0].faceName() + "s";
}

export const wordForPlayed = (): string => {
  return sample([
    " played ",
    " laid down ",
    " dropped ",
    " smacked down ",
    " whipped out ",
  ]) || " played ";
}

export const generateReverseHint = (): string => {
    return " Next Player must play a 7 or lower.";
}

export const generateSkipHint = (cards: Card[]): string => {
    return " skipping " +
    cards.length +
     " players.";
}

export const generateClearHint = (playerName: string, cards: Card[]): string => {
    return playerName +
    wordForPlayed() +
    formattedCards(cards) +
    " which cleared the board! Go again " +
    playerName + ".";
}

export const generateDevilsHandHint = (playerName: string, nextPlayerName: string, cards: Card[]): string => {
    return playerName +
    wordForPlayed() +
    formattedCards(cards) +
    nextPlayerName +
    + " picks up that devil's hand.";
}

export const generatePickUpHint = (playerName: string): string => {
  return playerName +
  " picked up. Sucks to be them.";
}
