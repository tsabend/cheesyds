import {
   Card,
   FaceValue,
   canPlayOn
} from "./card"

export class Turn {
  cardsToSubmit: Array<Card> = [];
  currentFaceValue: FaceValue;
  constructor(currentFaceValue?: FaceValue,
              cardsToSubmit?: Array<Card>) {
                this.currentFaceValue = currentFaceValue || FaceValue.Three;
                this.cardsToSubmit = cardsToSubmit || [];
  }

  selectCard(card: Card): Turn {
    // validate selection: must all be same type
    if (!this.isValidSelection(card)) return this;
    if (this.isSelected(card)) {
      // unselect
      return new Turn(this.currentFaceValue, this.cardsToSubmit.filter(_card => card !== _card));
    }
    else {
      // select
      return new Turn(this.currentFaceValue, this.cardsToSubmit.concat([card]));
    }
  }

  isSelected(card: Card): boolean {
    return this.cardsToSubmit.indexOf(card) !== -1
  }

  isValidSelection(card: Card): boolean {
    const faceValue = card.faceValue
    const canPlayOnTop = canPlayOn(faceValue, this.currentFaceValue)
    console.log("can", faceValue, "play on", this.currentFaceValue, "===", canPlayOnTop);
    if (!canPlayOnTop) return false;
    if (this.cardsToSubmit.length === 0) return true;
    return this.cardsToSubmit[0].faceValue === faceValue;
  }
}
