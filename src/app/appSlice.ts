import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useDispatch } from "react-redux";
import { v4 as generateUUID } from "uuid";
import { AppThunk, RootState } from './store';
import { Result, ok, Ok, err, Err } from "neverthrow";
import { Card } from "./card"
import { GameSnapshot, GameBuilder } from "./game"
import { Turn } from "./turn"
import {
  RemoteGameState,
  makeInitialAppState,
  AppState,
  AppProgress,
  gameController,
  pairingController
} from "./appState"

const initialState = makeInitialAppState();

export const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Pairing logic
    startLoading: (state) => {
      state.progress = AppProgress.Loading;
    },
    finishPairing: (state, action: PayloadAction<RemoteGameState>) => {
      state.progress = AppProgress.Waiting;
      state.game = action.payload;
    },
    joinGame: (state, action: PayloadAction<RemoteGameState>) => {
      state.progress = AppProgress.Joining;
      state.game = action.payload;
    },
    startGame: state => {
      state.progress = AppProgress.GameStarted;
    },
    restart: state => {
      state.progress = AppProgress.Landing;
    },
    // Game play logic
    submit: (state) => {
      const remoteGame = state.game as RemoteGameState
      const game = state.game?.game as GameSnapshot
      if (remoteGame && game) {
        const newSnapshot = gameController.submit(state.turn.cardsToSubmit, game);
        remoteGame.game = newSnapshot;
        state.game = remoteGame;
        state.turn = new Turn(game.topOfInPlayPile()?.faceValue, [], game.isInReverse);
      }
    },
    selectCard: (state, card: PayloadAction<Card>) => {
      state.turn = state.turn.selectCard(card.payload);
    },
    pickUp: state => {
      const remoteGame = state.game as RemoteGameState
      const game = state.game?.game as GameSnapshot
      if (remoteGame && game) {
        const newSnapshot = gameController.pickUp(game);
        remoteGame.game = newSnapshot;
        state.turn = new Turn();
      }
    }
  },
});

// functions exposed to react

export const joinGameAsync = (gameId: string, playerName: string): AppThunk => dispatch => {
  dispatch(startLoading());
  pairingController.joinExistingSession(gameId, playerName, result => {
    if (result.isOk()) {
      dispatch(joinGame(result._unsafeUnwrap()))
    }
  });
};

export const startPairingAsync = (playerName: string): AppThunk => dispatch => {
  dispatch(startLoading());
  pairingController.openNewSession(playerName, result => {
    if (result.isOk()) dispatch(finishPairing(result._unsafeUnwrap()))
  });
};

export const cancelGame = (): AppThunk => dispatch => {
  pairingController.cancel();
  dispatch(restart());
}

// Actions

export const { startLoading, finishPairing, restart, startGame, joinGame, submit, selectCard, pickUp } = slice.actions;

// Properties

export const selectAppProgress = (state: RootState) => state.app.progress;
export const selectPairingPlayers = (state: RootState) => state.app.game?.players || [];
export const selectRemoteGameId = (state: RootState) => state.app.game?.gameId || "";
export const selectGameSnapshot = (state: RootState) => state.app.game?.game || new GameBuilder().makeFakeGame(); // FIXME
export const selectMe = (state: RootState) => state.app.me;
export const selectTurn = (state: RootState) => state.app.turn;

export default slice.reducer;
