import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  AppProgress,
  copyRemoteGameState,
  gameController,
  makeInitialAppState,
  pairingController,
  RemoteGameState,
} from "./appState";
import Card from "./card";
import GameBuilder from "./GameBuilder";
import GameSnapshot from "./GameSnapshot";
import { AppThunk, RootState } from "./store";
import { AppState } from "./appState";

const initialState = makeInitialAppState();

export const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // Pairing logic
    startLoading: (state) => {
      console.log("startLoading");
      state.progress = AppProgress.Loading;
    },
    finishPairing: (state, action: PayloadAction<string>) => {
      console.log("finishPairing. me=", action.payload);
      state.me = action.payload;
      state.progress = AppProgress.Waiting;
    },
    joinGame: (state, action: PayloadAction<string>) => {
      console.log("joinGame. me=", action.payload);
      state.me = action.payload;
      state.progress = AppProgress.Joining;
    },
    startGame: (state) => {
      console.log("start game");
      state.progress = AppProgress.GameStarted;
    },
    startGameVsComputer: (state, action: PayloadAction<string>) => {
      console.log("start game");
      state.me = action.payload;
      state.progress = AppProgress.GameStarted;
    },
    restart: (state) => {
      console.log("restarting game");
      state.game = undefined;
      state.progress = AppProgress.Landing;
      state.me = "";
    },
    // Game play logic
    updateGameState: (state, action: PayloadAction<RemoteGameState>) => {
      console.log("UPDATING GAME STATE TO:", action.payload);
      state.game = action.payload;
    },
  },
});

// functions exposed to react

export const joinGameAsync = (gameId: string, playerName: string): AppThunk => (dispatch) => {
  dispatch(startLoading());
  let hasJoined = false;
  let gameStarted = false;
  pairingController.joinExistingSession(gameId, playerName, (result) => {
    if (result.isOk()) {
      if (!hasJoined) {
        hasJoined = true;
        dispatch(joinGame(playerName));
      }
      const game = result._unsafeUnwrap();
      if (!gameStarted && game.game != null) {
        gameStarted = true;
        dispatch(startGame());
      }
      dispatch(updateGameState(game));
    }
    else {
      dispatch(restart());
    }
  });
};

export const startPairingAsync = (playerName: string): AppThunk => (dispatch) => {
  dispatch(startLoading());
  let hasJoined = false;
  pairingController.openNewSession(playerName, (result) => {
    if (result.isOk())  {
      if (!hasJoined) {
        hasJoined = true;
        dispatch(finishPairing(playerName));
      }
      dispatch(updateGameState(result._unsafeUnwrap()));
    }
    else {
      console.log("ERR", result._unsafeUnwrapErr());
    }
  });
};

export const startGameAsync = (state: RemoteGameState): AppThunk => (dispatch) => {
  console.log("starting game async");
  dispatch(startLoading());
  const start = new GameBuilder().makeGame(state.players);
  const game = gameController.deal(start);
  let newState = copyRemoteGameState(state);
  newState.game = game;
  pairingController.writeGameState(newState);
  dispatch(startGame());
};

export const startGameVsCPU = (state?: RemoteGameState): AppThunk => (dispatch) => {
  dispatch(startLoading());
  const punishments = state?.game?.punishments || [];
  let newState: RemoteGameState = {
    players: ["Human"],
    gameId: "1234",
  };

  const start = new GameBuilder().makeSoloGame(newState.players, punishments);
  const game = gameController.deal(start);
  newState = copyRemoteGameState(newState);
  newState.game = game;
  dispatch(startGameVsComputer("Human"));
  dispatch(updateGameState(newState));
  // auto start game
  dispatch(pickUpCards(newState));
};

export const quitGame = (state: AppState): AppThunk => (dispatch) => {
  pairingController.quit(state.me, state.game);
  dispatch(restart());
};

export const submitCards = (cards: Card[], state: RemoteGameState): AppThunk => (dispatch) => {
  const game = state.game as GameSnapshot;
  if (!game) return;
  let newState = copyRemoteGameState(state);
  newState.game = gameController.submit(cards, game);
  console.log(newState.game.lastTurnSummary || "first turn");
  dispatch(writeState(newState));
};

export const pickUpCards = (state: RemoteGameState): AppThunk => (dispatch) => {
  const game = state.game as GameSnapshot;
  if (!game) return;
  let newState = copyRemoteGameState(state);
  newState.game = gameController.pickUp(game);
  dispatch(writeState(newState));
};

export const savePunishment = (punishment: string, state: RemoteGameState): AppThunk => (dispatch) => {
  const game = state.game as GameSnapshot;
  if (!game) return;
  let newState = copyRemoteGameState(state);
  const finalPunishment = "" + (game.winner?.name || "") + " has punished " + (game.loser()?.name || "") + ": " + punishment;
  newState.game?.punishments.push(finalPunishment);
  dispatch(writeState(newState));
};

export const playAgain = (state: RemoteGameState): AppThunk => (dispatch) => {
  // TODO...
  dispatch(startGameVsCPU(state));
};

const writeState = (state: RemoteGameState): AppThunk => (dispatch) => {
  // it's a multiplayer game
  if (state.fbGameId) {
    pairingController.writeGameState(state);
  }
  // it's a local game
  else {
    dispatch(updateStateAndRunComputersTurn(state));
  }
};

const updateStateAndRunComputersTurn  = (state: RemoteGameState): AppThunk => (dispatch) => {
  // update local state
  dispatch(updateGameState(state));
  const newGame = state.game;
  if (!newGame) return;
  const newCurrentPlayer = newGame.currentPlayer();
  const autoplay = false;
  const keepPlaying = autoplay || newCurrentPlayer.isComputer;
  if (keepPlaying && !newGame.isOver()) {
    const cards = newCurrentPlayer.generateComputerSelection(newGame.topOfInPlayPile());
    if (cards.length > 0) {
      doAsync(() => dispatch(submitCards(cards, state)));
    }
    else {
      doAsync(() => dispatch(pickUpCards(state)));
    }
  }
};

const doAsync = (callback: () => void) => {
  setTimeout(() => {
    callback();
  },
  250);
  //0.000001);
};

// Actions

export const {
  startLoading,
  finishPairing,
  restart,
  startGame,
  joinGame,
  updateGameState,
  startGameVsComputer,
} = slice.actions;

// Properties

export const selectAppProgress = (state: RootState) => state.app.progress;
export const selectPairingPlayers = (state: RootState) => state.app.game?.players || [];
export const selectRemoteGame = (state: RootState) => state.app.game;
export const selectRemoteGameId = (state: RootState) => state.app.game?.gameId || "";
export const selectGameSnapshot = (state: RootState) => state.app.game?.game || new GameBuilder().makeFakeGame(); // FIXME
export const selectMe = (state: RootState) => state.app.me;
export const selectMyPlayer = (state: RootState) => state.app.game?.game?.players?.find((player) => player.name === state.app.me);
export const selectLastTurnSummary = (state: RootState) => state.app.game?.game?.lastTurnSummary;
export const selectAppState = (state: RootState) => state.app;

export default slice.reducer;
