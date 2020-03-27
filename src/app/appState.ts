import { GameSnapshot, GameBuilder } from "./game"
import { PairingController } from "./PairingController"
import { GameController } from "./GameController"
import { fire, FBApp } from './fire';
import { Turn } from "./turn"

export enum AppProgress {
  Landing,
  Loading,
  Waiting,
  Joining,
  GameStarted,
}

export interface RemoteGameState {
  players: Array<string>
  gameId: string,
  fbGameId?: string
  game?: GameSnapshot
}

export interface AppState {
  progress: AppProgress
  game?: RemoteGameState
  turn: Turn
  me: string
}

export const pairingController = new PairingController(fire);
export const gameController = new GameController();

// in case special construction logic is needed
export const makeInitialAppState = (): AppState => {
  const players = [
    "thomas",
    "monic"
  ]
  const start = new GameBuilder().makeGame(players);
  const game = gameController.deal(start);
  // const start = new GameBuilder().makeAlmostFinshedGame(gameController);
  // const game = start
  const startedGame = {
    progress: AppProgress.GameStarted,
    game: {
      gameId: "0247",
      players: players,
      fbGameId: undefined,
      game: game
    },
    turn: new Turn(),
    me: "thomas"
  }
  return startedGame;
  // return {
  //   progress: PairingProgress.Landing,
  //   game: undefined,
  // };
}
