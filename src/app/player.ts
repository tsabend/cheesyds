import Card from "./card";
import { Deck } from "./deck";
import {
  sample,
  zip,
  intersection,
  replace,
} from "./utility";
import { canPlay } from "./rule";

export class Player {
  name: string;
  board: PlayerBoard;
  isComputer: boolean;
  needsSwapping: boolean;

  static from(data: any): Player {
    const rawBoard = data.board;
    let board;
    if (rawBoard) {
      board = PlayerBoard.from(rawBoard);
    }
    return new Player(data.name, board, data.isComputer, data.needsSwapping);
  }

  constructor(name: string,
              board?: PlayerBoard,
              isComputer?: boolean,
              needsSwapping?: boolean) {
    this.name = name;
    this.board = board || new PlayerBoard();
    this.isComputer = isComputer || false;
    this.needsSwapping = needsSwapping || false;
  }

  copy(): Player {
    return new Player(this.name, this.board.copy(), this.isComputer, this.needsSwapping);
  }

  isOut(): boolean {
    return this.board.isOut();
  }

  deal(cards: Card[]) {
    this.board.deal(cards);
  }

  submit(cards: Card[]) {
    this.board.submit(cards);
  }

  draw(deck: Deck) {
    // draw until you have at least 3 cards
    while (this.board.hand.length < 3 && deck.isEmpty() === false) {
      const deal = deck.deal(1);
      if (deal) {
        this.board.hand = this.board.hand.concat(deal);
      }
    }
  }

  swap(cards: Card[]) {
    this.board.swap(cards)
  }

  pickUp(cards: Card[]) {
    this.board.pickUp(cards);
  }

  isVaultEnabled(): boolean {
    return this.isEliminatingPiles() || this.needsSwapping;
  }

  isEliminatingPiles(): boolean {
    return this.numberOfCards() === 0;
  }

  numberOfCards(): number {
    return this.board.hand.length;
  }

  // computer AI
  generateComputerSelection(topOfInPlayPile?: Card): Card[] {
    if (this.board.hand.length > 0) {
      return this.pickCardsToPlayFromPile(this.board.hand, topOfInPlayPile);
    }
    else {
      return this.pickCardsToPlayFromPile(this.board.playablePileCards(), topOfInPlayPile);
    }
  }

  pickCardsToPlayFromPile(pile: Card[], topOfInPlayPile?: Card): Card[] {
    const validCards = pile.filter((card) => canPlay(card.faceValue, topOfInPlayPile?.faceValue));
    const sampleCard = sample(validCards);
    if (!sampleCard) return [];
    return validCards.filter((card) => card.faceValue === sampleCard.faceValue);
  }
}

export class PlayerBoard {

  hand: Card[];
  faceDownVault: Card[];
  faceUpVault: Card[];
  static from(data: any): PlayerBoard {
    let hand = Card.arrayFrom(data.hand);
    let faceDownVault = Card.arrayFrom(data.faceDownVault);
    let faceUpVault = Card.arrayFrom(data.faceUpVault);

    return new PlayerBoard(hand, faceDownVault, faceUpVault);
  }
  constructor(hand?: Card[],
              faceDownVault?: Card[],
              faceUpVault?: Card[]) {
                this.hand = hand || [];
                this.faceDownVault = faceDownVault || [];
                this.faceUpVault = faceUpVault || [];
  }

  copy(): PlayerBoard {
    return new PlayerBoard(
      Array.from(this.hand),
      Array.from(this.faceDownVault),
      Array.from(this.faceUpVault),
    );
  }

  isOut(): boolean {
    return this.hand.length === 0 && this.faceDownVault.length === 0 && this.faceUpVault.length === 0;
  }

  sortedHand(): Card[] {
    return this.hand.sort((a, b) => a.faceValue > b.faceValue ? -1 : 1);
  }

  // deal out an array of 6 cards
  deal(cards: Card[]) {
    const newHand = cards.splice(0, 3);
    const faceDownVault = cards.splice(0, 3);
    const faceUpVault = cards.splice(0, 3);

    this.hand = newHand;
    this.faceDownVault = faceDownVault;
    this.faceUpVault = faceUpVault;
  }

  submit(cards: Card[]) {
    const newHand = this.hand.filter((_card) => cards.indexOf(_card) === -1);
    const newFaceUpVault = this.faceUpVault.filter((_card) => cards.indexOf(_card) === -1);
    const newFaceDownVault = this.faceDownVault.filter((_card) => cards.indexOf(_card) === -1);
    this.hand = newHand;
    this.faceUpVault = newFaceUpVault;
    this.faceDownVault = newFaceDownVault;
  }

  pickUp(cards: Card[]) {
    const newHand = this.hand.concat(cards);
    this.hand = newHand;
  }

  swap(cards: Card[]) {
    const fromHandToVault: Card = intersection(cards, this.hand)[0];
    const fromVaultToHand: Card = intersection(cards, this.faceUpVault)[0];
    if (!fromHandToVault || !fromVaultToHand) return;
    this.hand = replace(fromHandToVault, fromVaultToHand, this.hand);
    this.faceUpVault = replace(fromVaultToHand, fromHandToVault, this.faceUpVault);
  }

  playablePileCards(): Card[] {
    if (this.hand.length > 0) return [];
    if (this.faceUpVault.length > 0) return this.faceUpVault;
    return this.faceDownVault;
  }

  vault(): Card[][] {
    return zip(this.faceDownVault, this.faceUpVault);
  }
}
