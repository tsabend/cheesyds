import { fire } from "./fire";
import { GameController } from "./GameController";
import GameSnapshot from "./GameSnapshot";
import { PairingController } from "./PairingController";

export enum AppProgress {
  Landing,
  Loading,
  Waiting,
  Joining,
  GameStarted,
  Rejoining,
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
  me: string;
}

const appStateFromJSON = (json: any): AppState | undefined => {
  const progress = json.progress;
  const game = json.game;
  const me = json.me;
  if (!progress || !game || !me) return undefined;
  if (game.game) {
    game.game = GameSnapshot.from(game.game);
  }
  return {
    progress: progress,
    game: game,
    me: me
  }
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
  //   me: "thomas"
  // }
  // return startedGame;

  const isDebug = false;
  if (isDebug) {
    localStorage.setItem("reduxState", "");
  }
  const local = localStorage.getItem("reduxState");
  try {
  if (local && local.length > 0) {
    const rawRecoveredState = JSON.parse(local);
    const recoveredState = appStateFromJSON(rawRecoveredState);
    if (recoveredState) {
        recoveredState.progress = AppProgress.Rejoining;
        return recoveredState;
      }
    }
  }
  catch {}
  return {
    progress: AppProgress.Landing,
    game: undefined,
    me: "",
  };
};
