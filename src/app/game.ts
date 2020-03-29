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
import { Deck } from "./deck";

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
      snapshot.currentPlayerIndex = snapshot.nextPlayerIndex();
      snapshot.isInReverse = willReverse;
    });
  }

  clear(cards: Card[], snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().submit(cards);
      snapshot.currentPlayer().draw(snapshot.deck);
      snapshot.inPlayPile = [];
      snapshot.currentPlayerIndex = snapshot.nextPlayerIndex();
    });
  }

  forcePickUp(cards: Card[], snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().submit(cards);
      snapshot.currentPlayer().draw(snapshot.deck);
      snapshot.nextPlayer().pickUp(snapshot.inPlayPile);
      snapshot.inPlayPile = [];
      snapshot.currentPlayerIndex = snapshot.playerIndexSkipping(2);
    });
  }

  skip(skipCount: number, cards: Card[], snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().submit(cards);
      snapshot.currentPlayer().draw(snapshot.deck);
      snapshot.inPlayPile = snapshot.inPlayPile.concat(cards);
      snapshot.currentPlayerIndex = snapshot.playerIndexSkipping(skipCount + 1);
    });
  }

  pickUp(snapshot: GameSnapshot): GameSnapshot {
    return this.mutate(snapshot, (snapshot) => {
      snapshot.currentPlayer().pickUp(snapshot.inPlayPile);
      snapshot.inPlayPile = [];
      snapshot.currentPlayerIndex = snapshot.nextPlayerIndex();
    });
  }
}

export class GameBuilder {
  makeFakeGame(): GameSnapshot {
    const players = [
      new Player("1. Thomas"),
      new Player("2. Monica"),
      new Player("3. Jojo"),
    ];

    return new GameSnapshot(players, new Deck(), [], 0, false);
  }

  makeGame(players: string[]): GameSnapshot {
    return new GameSnapshot(
      players.map((name) => new Player(name)),
      new Deck(),
      [],
      0,
      false,
    );
  }

  // Simulate end of game
  makeAlmostFinshedGame(controller: GameController): GameSnapshot {
    const snapshot = new GameBuilder().makeFakeGame();
    const initial = controller.deal(snapshot);
    initial.deck.cards = [];
    initial.players[0].board.hand = [];
    initial.players[0].board.piles[0] = [];
    initial.players[0].board.piles[1] = [];
    initial.players[0].board.piles[2].pop();
    initial.players[1].board.hand = [];
    initial.players[1].board.piles[0] = [];
    initial.players[1].board.piles[1] = [];
    initial.players[1].board.piles[2].pop();
    return initial;
  }
}
