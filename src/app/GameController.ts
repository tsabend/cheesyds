import Card from "./card";
import {
  getRule,
  canPlay,
  Rule,
} from "./rule";
import { Player } from "./player";
import GameSnapshot from "./GameSnapshot";
import {
  generatePlayHint,
  generateClearHint,
  generateDevilsHandHint,
  generatePickUpHint,
 } from "./hintHelper";

export class GameController {
  deal(snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.players.forEach((player: Player) => {
        player.deal(snapshot.deck.deal(9));
      });
      return snapshot;
    });
  }

  mutate(snapshot: GameSnapshot, mutation: (snapshot: GameSnapshot) => GameSnapshot): GameSnapshot {
    const copy = snapshot.copy();
    return mutation(copy);
  }

  submit(cards: Card[], snapshot: GameSnapshot): GameSnapshot {
    if (cards.length === 0) return snapshot;
    if (!canPlay(cards[0].faceValue, snapshot.topOfInPlayPile()?.faceValue)) {
      return this.pickUp(snapshot, cards)
    }
    const rule = getRule(cards, snapshot.inPlayPile);
    switch (rule) {
      case Rule.Play:
      return this.play(cards, 0, snapshot);
      case Rule.Clear:
      return this.clear(cards, snapshot);
      case Rule.ForcePickUp:
      return this.forcePickUp(cards, snapshot);
      case Rule.ReverseForOneTurn:
      return this.play(cards, 0, snapshot);
      case Rule.SkipOne:
      return this.play(cards, 1, snapshot);
      case Rule.SkipTwo:
      return this.play(cards, 2, snapshot);
      case Rule.SkipThree:
      return this.play(cards, 3, snapshot);
      default:
      return this.play(cards, 0, snapshot);
    }
  }

  swap(handCard: Card, vaultCard: Card, snapshot: GameSnapshot) {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().swap(handCard, vaultCard);
      return snapshot;
    });
  }

  finishSwapping() {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().swap(handCard, vaultCard);
      return snapshot;
    });
  }

  play(cards: Card[], skipCount: number, snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().submit(cards);
      snapshot.inPlayPile = snapshot.inPlayPile.concat(cards);
      snapshot.lastTurnSummary = generatePlayHint(snapshot.currentPlayer().name, skipCount, cards);
      return this.finishTurn(1 + skipCount, snapshot);
    });
  }

  clear(cards: Card[], snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().submit(cards);
      snapshot.inPlayPile = [];
      snapshot.lastTurnSummary = generateClearHint(snapshot.currentPlayer().name, cards);
      return this.finishTurn(0, snapshot);
    });
  }

  forcePickUp(cards: Card[], snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().submit(cards);
      snapshot.nextPlayer().pickUp(snapshot.inPlayPile);
      snapshot.inPlayPile = [];
      snapshot.lastTurnSummary = generateDevilsHandHint(snapshot.currentPlayer().name, snapshot.players[snapshot.playerIndexSkipping(1)].name,  cards);
      return this.finishTurn(2, snapshot);
    });
  }

  pickUp(snapshot: GameSnapshot, cards?: Card[]): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      if (cards) {
        snapshot.currentPlayer().submit(cards);
      }
      snapshot.currentPlayer().pickUp(snapshot.inPlayPile);
      snapshot.inPlayPile = [];
      snapshot.lastTurnSummary = generatePickUpHint(snapshot.currentPlayer().name);
      return this.finishTurn(1, snapshot);
    });
  }

  finishTurn(moveForwardsBy: number, snapshot: GameSnapshot): GameSnapshot {
    snapshot.currentPlayer().draw(snapshot.deck);
    snapshot.finishTurn(moveForwardsBy);
    // run logic for computer's turns
    // TODO: save up computer turn lastTurnSummarys
    while (snapshot.currentPlayer().isComputer && snapshot.isOver() === false) {
      const cards = snapshot.currentPlayer().generateComputerSelection(snapshot.topOfInPlayPile());
      if (cards.length > 0) {
        return this.submit(cards, snapshot);
      }
      else {
        return this.pickUp(snapshot);
      }
    }
    console.log("ran computer's turn.", snapshot.lastTurnSummary, snapshot.currentPlayerIndex);
    return snapshot;
  }
}
