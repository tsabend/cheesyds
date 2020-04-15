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

export interface Session {
  players: string[];
  id: string;
  game?: GameSnapshot;
}

export const copySession = (state: Session) => {
  return  {
    players: Array.from(state.players),
    id: state.id,
    game: state.game?.copy(),
  };
};

export interface AppState {
  progress: AppProgress;
  session?: Session;
  me: string;
}

const appStateFromJSON = (json: any): AppState | undefined => {
  const progress = json.progress;
  const session = json.session;
  const me = json.me;
  if (!progress || !session || !me) return undefined;
  if (session.game) {
    session.game = GameSnapshot.from(session.game);
  }
  return {
    progress: progress,
    session: session,
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
  //     id: "0247",
  //     players: players,
  //     fbid: "-M3MS5UkhTtrhpUlhVli",
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
    session: undefined,
    me: "",
  };
};
