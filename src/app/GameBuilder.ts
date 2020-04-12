import { Deck } from "./deck";
import GameSnapshot from "./GameSnapshot";
import { Player } from "./player";

export default class GameBuilder {
  makeFakeGame(): GameSnapshot {
    const players = [
      new Player("1. Thomas"),
      new Player("2. Monica"),
      new Player("3. Jojo"),
    ];

    return new GameSnapshot(players, new Deck(), [], 0, ["Jojo cannot use proper nouns"]);
  }

  makeGame(players: string[]): GameSnapshot {
    return new GameSnapshot(
      players.map((name) => new Player(name, undefined, false, true)),
      Deck.makeDeck(players.length),
      [],
      0,
      [],
      this.makeGameStartHint(),
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
    const gamePlayers = [human].concat(bots);
    return new GameSnapshot(
      gamePlayers,
      Deck.makeDeck(gamePlayers.length),
      [],
      0,
      punishments,
      this.makeGameStartHint(),
    );
  }

  makeOpenHandedGame(players: string[], punishments: string[]): GameSnapshot {
    console.log("MAKING OPEN HANDED GAME");
    const human = new Player(players[0], undefined, false, true);
    const bots = [
      new Player("Burgie", undefined, false, true),
      // new Player("Monica", undefined, false, true),
      // new Player("Jojo", undefined, false, true),
      // new Player("Sawyer", undefined, false, true),
      // new Player("James", undefined, false, true),
      // new Player("Liz", undefined, false, true),
    ];
    const gamePlayers = [human].concat(bots);
    const deck = Deck.makeDeck(gamePlayers.length);
    return new GameSnapshot(
      gamePlayers,
      deck,
      [],
      0,
      punishments,
      this.makeGameStartHint(),
    );
  }

  makeGameStartHint(): string {
    return "Welcome to CheezyD. Start out by swapping cards from your hand and vault. Stash away a few good cards for later, then click finish swapping when you're done."
  }
}
