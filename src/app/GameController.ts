import {
  Card,
  FaceValue,
  getRule,
  Rule,
  Suit,
} from "./card";
import { Player } from "./player";
import { Turn } from "./turn";

import {
  GameSnapshot,
} from "./game";

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
      snapshot.finishTurn(1);
    });
  }

  clear(cards: Card[], snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().submit(cards);
      snapshot.currentPlayer().draw(snapshot.deck);
      snapshot.inPlayPile = [];
      snapshot.finishTurn(1);
    });
  }

  forcePickUp(cards: Card[], snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().submit(cards);
      snapshot.currentPlayer().draw(snapshot.deck);
      snapshot.nextPlayer().pickUp(snapshot.inPlayPile);
      snapshot.inPlayPile = [];
      snapshot.finishTurn(2);
    });
  }

  skip(skipCount: number, cards: Card[], snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().submit(cards);
      snapshot.currentPlayer().draw(snapshot.deck);
      snapshot.inPlayPile = snapshot.inPlayPile.concat(cards);
      snapshot.finishTurn(skipCount + 1);
    });
  }

  pickUp(snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().pickUp(snapshot.inPlayPile);
      snapshot.inPlayPile = [];
      snapshot.finishTurn(1);
    });
  }
}
