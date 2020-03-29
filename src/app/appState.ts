import { FBApp, fire } from "./fire";
import { GameBuilder, GameSnapshot } from "./game";
import { GameController } from "./GameController";
import { PairingController } from "./PairingController";
import { Turn } from "./turn";

export enum AppProgress {
  Landing,
  Loading,
  Waiting,
  Joining,
  GameStarted,
}

export interface RemoteGameState {
  players: string[];
  gameId: string;
  fbGameId?: string;
  game?: GameSnapshot;
}

export const copyRemoteGameState = (state: RemoteGameState) => {
  return  {
    players: Array.from(state.players),
    gameId: state.gameId,
    fbGameId: state.fbGameId,
    game: state.game?.copy(),
  };
};

export interface AppState {
  progress: AppProgress;
  game?: RemoteGameState;
  turn: Turn;
  me: string;
}

export const pairingController = new PairingController(fire);
export const gameController = new GameController();

// in case special construction logic is needed
export const makeInitialAppState = (): AppState => {
  // const players = [
  //   "thomas",
  //   "monic"
  // ]
  // const start = new GameBuilder().makeGame(players);
  // const game = gameController.deal(start);
  // // const start = new GameBuilder().makeAlmostFinshedGame(gameController);
  // // const game = start
  // const startedGame = {
  //   progress: AppProgress.GameStarted,
  //   game: {
  //     gameId: "0247",
  //     players: players,
  //     fbGameId: "-M3MS5UkhTtrhpUlhVli",
  //     game: game
  //   },
  //   turn: new Turn(game.topOfInPlayPile()?.faceValue, [], game.isInReverse),
  //   me: "thomas"
  // }
  // return startedGame;

  localStorage.setItem('reduxState', "")
  const local = localStorage.getItem("reduxState")
  if (local && local.length > 0) {
    return JSON.parse(local)
  }

  return {
    progress: AppProgress.Landing,
    game: undefined,
    turn: new Turn(),
    me: "",
  };
};
