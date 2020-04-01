import Card from "./card"
import {
  getRule,
  Rule,
} from "./rule";
import { Deck } from "./deck";
import GameSnapshot from "./GameSnapshot";
import { GameController } from "./GameController";
import { Player } from "./player";

export class GameBuilder {
  makeFakeGame(): GameSnapshot {
    const players = [
      new Player("1. Thomas"),
      new Player("2. Monica"),
      new Player("3. Jojo"),
    ];

    return new GameSnapshot(players, new Deck(), [], 0, false, ["Jojo cannot use proper nouns"]);
  }

  makeGame(players: string[]): GameSnapshot {
    return new GameSnapshot(
      players.map((name) => new Player(name)),
      new Deck(),
      [],
      0,
      false,
      [],
    );
  }

  makeSoloGame(players: string[], punishments: string[]): GameSnapshot {
    console.log("MAKING SOLO GAME");
    const human = new Player(players[0]);
    const bots = [
      new Player("Burgie", undefined, true),
      new Player("Monica", undefined, true),
      new Player("Jojo", undefined, true),
      new Player("Sawyer", undefined, true),
      new Player("James", undefined, true),
      new Player("Liz", undefined, true),
    ];
    return new GameSnapshot(
      [human].concat(bots),
      new Deck(),
      [],
      0,
      false,
      punishments,
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
