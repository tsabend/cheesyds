import {
   canPlayOn,
   Card,
   FaceValue,
} from "./card";
import { Player } from "./player";

export class Turn {
  currentFaceValue: FaceValue;
  cardsToSubmit: Card[] = [];
  isInReverse: boolean;
  constructor(currentFaceValue?: FaceValue,
              cardsToSubmit?: Card[],
              isInReverse?: boolean) {
                this.currentFaceValue = currentFaceValue || FaceValue.Three;
                this.cardsToSubmit = cardsToSubmit || [];
                this.isInReverse = isInReverse || false;
  }

  generateComputerSelection(player: Player): Card[] {
    if (player.board.hand.length === 0) {
      const topOfPile = player.board.piles
      .filter((pile) => pile.length === 2)
      .map((pile) => pile[1]);
      const sampleTopOfPile = sample(topOfPile);
      if (sampleTopOfPile) {
        return topOfPile.filter((card) => card.faceValue === sampleTopOfPile.faceValue);
      }
      else {
        const bottomOfPile = player.board.piles
        .filter((pile) => pile.length === 1)
        .map((pile) => pile[0]);
        const sampleBottomOfPile = sample(bottomOfPile);
        if (sampleBottomOfPile) {
          return bottomOfPile.filter((card) => card.faceValue === sampleBottomOfPile.faceValue);
        }
      }
      return [];
    }
    const validCards = player.board.hand.filter((card) => this.isValidSelection(card));
    const sampleCard = sample(validCards);
    if (!sampleCard) return [];
    return validCards.filter((card) => card.faceValue === sampleCard.faceValue);
  }

  selectCard(card: Card): Turn {
    // validate selection: must all be same type
    if (!this.isValidSelection(card)) return this;
    if (this.isSelected(card)) {
      // unselect
      return new Turn(this.currentFaceValue, this.cardsToSubmit.filter((_card) => card !== _card));
    }
    else {
      // select
      return new Turn(this.currentFaceValue, this.cardsToSubmit.concat([card]));
    }
  }

  isSelected(card: Card): boolean {
    return this.cardsToSubmit.indexOf(card) !== -1;
  }

  isValidSelection(card: Card): boolean {
    const faceValue = card.faceValue;
    const canPlayOnTop = canPlayOn(faceValue, this.currentFaceValue, this.isInReverse);
    if (!canPlayOnTop) return false;
    if (this.cardsToSubmit.length === 0) return true;
    return this.cardsToSubmit[0].faceValue === faceValue;
  }
}

const shuffle = function<T>(array: T[]): T[] {
	let currentIndex = array.length;
	let temporaryValue, randomIndex;
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
};

const sample = function<T>(array: T[]): T | undefined {
  return shuffle(array)[0];
};
