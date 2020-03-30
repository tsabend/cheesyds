import {
  Card,
  FaceValue,
  getRule,
  Rule,
  Suit,
} from "./card";
import { Player } from "./player";
import { Turn } from "./turn";

import GameSnapshot from "./GameSnapshot"

export class GameController {
  deal(snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.players.forEach((player: Player) => {
        player.deal(snapshot.deck.deal(9));
      });
    });
  }

  mutate(snapshot: GameSnapshot, mutation: (snapshot: GameSnapshot) => void): GameSnapshot {
    const copy = snapshot.copy();
    mutation(copy);
    return copy;
  }

  submit(cards: Card[], snapshot: GameSnapshot): GameSnapshot {
    if (cards.length === 0) return snapshot;
    switch (getRule(cards)) {
      case Rule.Play:
      return this.play(cards, snapshot);
      case Rule.Clear:
      return this.clear(cards, snapshot);
      case Rule.ForcePickUp:
      return this.forcePickUp(cards, snapshot);
      case Rule.ReverseForOneTurn:
      return this.reverse(cards, snapshot);
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
    return this._play(cards, false, snapshot);
  }

  reverse(cards: Card[], snapshot: GameSnapshot): GameSnapshot {
    return this._play(cards, true, snapshot);
  }

  _play(cards: Card[], willReverse: boolean, snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().submit(cards);
      snapshot.currentPlayer().draw(snapshot.deck);
      snapshot.inPlayPile = snapshot.inPlayPile.concat(cards);
      snapshot.isInReverse = willReverse;
      snapshot.lastTurnSummary = snapshot.currentPlayer().name +
      " played "
      + cards.map(card => card.userFacingName()).join(", ")
      + "."
      if (willReverse) {
        snapshot.lastTurnSummary += ". Next Player must play a 7 or lower."
      }
      snapshot.finishTurn(1);
    });
  }

  clear(cards: Card[], snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().submit(cards);
      snapshot.currentPlayer().draw(snapshot.deck);
      snapshot.isInReverse = false;
      snapshot.inPlayPile = [];
      snapshot.lastTurnSummary = snapshot.currentPlayer().name +
      " played "
      + cards.map(card => card.userFacingName()).join(", ")
      + " which cleared the board! Go again " + snapshot.currentPlayer().name + "."
      snapshot.finishTurn(0);
    });
  }

  forcePickUp(cards: Card[], snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().submit(cards);
      snapshot.currentPlayer().draw(snapshot.deck);
      snapshot.nextPlayer().pickUp(snapshot.inPlayPile);
      snapshot.isInReverse = false;
      snapshot.inPlayPile = [];
      snapshot.lastTurnSummary = snapshot.currentPlayer().name +
      " played "
      + cards.map(card => card.userFacingName()).join(", ")
      + " " + snapshot.players[snapshot.playerIndexSkipping(1)].name
      + " picks up that devil's hand."
      snapshot.finishTurn(2);
    });
  }

  skip(skipCount: number, cards: Card[], snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().submit(cards);
      snapshot.currentPlayer().draw(snapshot.deck);
      snapshot.inPlayPile = snapshot.inPlayPile.concat(cards);
      snapshot.lastTurnSummary = snapshot.currentPlayer().name +
      " played "
      + cards.map(card => card.userFacingName()).join(", ")
      + " skipping " + skipCount
      + " players."
      snapshot.finishTurn(skipCount + 1);
    });
  }

  pickUp(snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().pickUp(snapshot.inPlayPile);
      snapshot.inPlayPile = [];
      snapshot.isInReverse = false;
      snapshot.lastTurnSummary = snapshot.currentPlayer().name +
      " picked up. Sucks to be them."
      snapshot.finishTurn(1);
    });
  }
}
