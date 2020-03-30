import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { err, Err, ok, Ok, Result } from "neverthrow";
import { useDispatch } from "react-redux";
import { v4 as generateUUID } from "uuid";
import {
  AppProgress,
  AppState,
  copyRemoteGameState,
  gameController,
  makeInitialAppState,
  pairingController,
  RemoteGameState,
} from "./appState";
import { Card } from "./card";
import GameSnapshot from "./GameSnapshot"
import { GameBuilder } from "./game";
import { AppThunk, RootState } from "./store";
import { Turn } from "./turn";

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
    clearGameState: (state) => {
      state.turn = new Turn();
    },
    restart: (state) => {
      console.log("restarting game")
      state.progress = AppProgress.Landing;
    },
    // Game play logic
    updateGameState: (state, action: PayloadAction<RemoteGameState>) => {
      console.log("UPDATING GAME STATE TO:", action.payload);
      state.game = action.payload;
      const game = state.game?.game;
      if (game) {
        state.turn = new Turn(game.topOfInPlayPile()?.faceValue, [], game.isInReverse);
      }
    },
    selectCard: (state, card: PayloadAction<Card>) => {
      state.turn = state.turn.selectCard(card.payload);
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
  const punishments = state?.game?.punishments || []
  var newState: RemoteGameState = {
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
}

export const cancelGame = (): AppThunk => (dispatch) => {
  pairingController.cancel();
  dispatch(restart());
};

export const submitCards = (cards: Card[], state: RemoteGameState): AppThunk => (dispatch) => {
  const game = state.game as GameSnapshot;
  if (!game) return
  let newState = copyRemoteGameState(state);
  newState.game = gameController.submit(cards, game);
  console.log(newState.game.lastTurnSummary || "first turn");
  dispatch(writeState(newState));
};

export const pickUpCards = (state: RemoteGameState): AppThunk => (dispatch) => {
  const game = state.game as GameSnapshot;
  if (!game) return
  let newState = copyRemoteGameState(state);
  newState.game = gameController.pickUp(game);
  dispatch(writeState(newState));
};

export const savePunishment = (punishment: string, state: RemoteGameState): AppThunk => (dispatch) => {
  const game = state.game as GameSnapshot;
  if (!game) return
  let newState = copyRemoteGameState(state);
  const finalPunishment = "" + (game.winner?.name || "") + " has punished " + (game.loser()?.name || "") + ": " + punishment;
  newState.game?.punishments.push(finalPunishment);
  dispatch(writeState(newState));
}

export const playAgain = (state: RemoteGameState): AppThunk => (dispatch) => {
  // TODO...
  dispatch(clearGameState());
  dispatch(startGameVsCPU(state));
}

const writeState = (state: RemoteGameState): AppThunk => (dispatch) => {
  // it's a multiplayer game
  if (state.fbGameId) {
    pairingController.writeGameState(state);
  }
  // it's a local game
  else {
    dispatch(updateStateAndRunComputersTurn(state));
  }
}

const updateStateAndRunComputersTurn  = (state: RemoteGameState): AppThunk => (dispatch) => {
  // update local state
  dispatch(updateGameState(state));
  const newGame = state.game;
  if (!newGame) return;
  const newCurrentPlayer = newGame.currentPlayer();
  const autoplay = false;
  const keepPlaying = autoplay || newCurrentPlayer.isComputer;
  if (keepPlaying && !newGame.isOver()) {
    const turn = new Turn(newGame.topOfInPlayPile()?.faceValue, [], newGame.isInReverse);
    const cards = turn.generateComputerSelection(newCurrentPlayer);
    if (cards.length > 0) {
      doAsync(() => dispatch(submitCards(cards, state)));
    }
    else {
      doAsync(() => dispatch(pickUpCards(state)));
    }
  }
}

const doAsync = (callback: () => void) => {
  setTimeout(() => {
    callback();
  },
  250);
  //0.000001);
}

// Actions

export const {
  startLoading,
  finishPairing,
  restart,
  startGame,
  joinGame,
  updateGameState,
  selectCard,
  startGameVsComputer,
  clearGameState,
} = slice.actions;

// Properties

export const selectAppProgress = (state: RootState) => state.app.progress;
export const selectPairingPlayers = (state: RootState) => state.app.game?.players || [];
export const selectRemoteGame = (state: RootState) => state.app.game;
export const selectRemoteGameId = (state: RootState) => state.app.game?.gameId || "";
export const selectGameSnapshot = (state: RootState) => state.app.game?.game || new GameBuilder().makeFakeGame(); // FIXME
export const selectMe = (state: RootState) => state.app.me;
export const selectMyPlayer = (state: RootState) => state.app.game?.game?.players?.find(player => player.name === state.app.me);
export const selectLastTurnSummary = (state: RootState) => state.app.game?.game?.lastTurnSummary;
export const selectTurn = (state: RootState) => state.app.turn;

export default slice.reducer;
