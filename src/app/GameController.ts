import Card from "./card";
import {
  getRule,
  Rule,
} from "./rule";
import { Player } from "./player";
import GameSnapshot from "./GameSnapshot";
import { FaceValue } from "./faceValue";

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
    switch (getRule(cards, snapshot.inPlayPile)) {
      case Rule.Play:
      return this.play(cards, snapshot);
      case Rule.Clear:
      return this.clear(cards, snapshot);
      case Rule.ForcePickUp:
      return this.forcePickUp(cards, snapshot);
      case Rule.ReverseForOneTurn:
      return this.play(cards, snapshot);
      case Rule.SkipOne:
      return this.skip(1, cards, snapshot);
      case Rule.SkipTwo:
      return this.skip(2, cards, snapshot);
      case Rule.SkipThree:
      return this.skip(3, cards, snapshot);
      default:
      return this.play(cards, snapshot);
    }
  }


  play(cards: Card[], snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().submit(cards);
      snapshot.currentPlayer().draw(snapshot.deck);
      snapshot.inPlayPile = snapshot.inPlayPile.concat(cards);
      snapshot.lastTurnSummary = snapshot.currentPlayer().name +
      " played "
      + cards.map((card) => card.userFacingName()).join(", ")
      + ".";
      if (cards[0] && cards[0].faceValue === FaceValue.Seven) {
        snapshot.lastTurnSummary += ". Next Player must play a 7 or lower.";
      }
      return this.finishTurn(1, snapshot);
    });
  }

  clear(cards: Card[], snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().submit(cards);
      snapshot.currentPlayer().draw(snapshot.deck);
      snapshot.inPlayPile = [];
      snapshot.lastTurnSummary = snapshot.currentPlayer().name +
      " played "
      + cards.map((card) => card.userFacingName()).join(", ")
      + " which cleared the board! Go again " + snapshot.currentPlayer().name + ".";
      return this.finishTurn(0, snapshot);
    });
  }

  forcePickUp(cards: Card[], snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().submit(cards);
      snapshot.currentPlayer().draw(snapshot.deck);
      snapshot.nextPlayer().pickUp(snapshot.inPlayPile);
      snapshot.inPlayPile = [];
      snapshot.lastTurnSummary = snapshot.currentPlayer().name +
      " played "
      + cards.map((card) => card.userFacingName()).join(", ")
      + " " + snapshot.players[snapshot.playerIndexSkipping(1)].name
      + " picks up that devil's hand.";
      return this.finishTurn(2, snapshot);
    });
  }

  skip(skipCount: number, cards: Card[], snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().submit(cards);
      snapshot.currentPlayer().draw(snapshot.deck);
      snapshot.inPlayPile = snapshot.inPlayPile.concat(cards);
      snapshot.lastTurnSummary = snapshot.currentPlayer().name +
      " played "
      + cards.map((card) => card.userFacingName()).join(", ")
      + " skipping " + skipCount
      + " players.";
      return this.finishTurn(skipCount + 1, snapshot);
    });
  }

  pickUp(snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().pickUp(snapshot.inPlayPile);
      snapshot.inPlayPile = [];
      snapshot.lastTurnSummary = snapshot.currentPlayer().name +
      " picked up. Sucks to be them.";
      return this.finishTurn(1, snapshot);
    });
  }

  finishTurn(moveForwardsBy: number, snapshot: GameSnapshot): GameSnapshot {
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
