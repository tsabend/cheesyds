import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useDispatch } from "react-redux";
import { v4 as generateUUID } from "uuid";
import { AppThunk, RootState } from '../../app/store';
import { fire, FBApp } from '../../app/fire';
import { Result, ok, Ok, err, Err } from "neverthrow";
import { PairingController, PairingGame } from "./PairingController"

export enum PairingProgress {
  Landing,
  Loading,
  Waiting,
  Joining,
}

export interface PairingState {
  progress: PairingProgress,
  players: Array<string>,
  gameId?: string,
  fbGameId?: string,

}

// in case special construction logic is needed
const makeInitialState = () => {
  return {
    progress: PairingProgress.Landing,
    players: [],
    gameId: undefined,
    fbGameId: undefined,
  };
}
const initialState: PairingState = makeInitialState();
export const slice = createSlice({
  name: 'pairing',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.progress = PairingProgress.Loading;
    },
    finishPairing: (state, action: PayloadAction<PairingGame>) => {
      state.progress = PairingProgress.Waiting;
      state.gameId = action.payload.gameId;
      state.players = action.payload.players;
      state.fbGameId = action.payload.fbGameId;
    },
    joinGame: (state: PairingState, action: PayloadAction<PairingGame>) => {
      state.progress = PairingProgress.Joining;
      state.gameId = action.payload.gameId;
      state.players = action.payload.players;
      state.fbGameId = action.payload.fbGameId;
    },
    startGame: state => {
      console.log("BUILD THE GAME NOW");
    },
    restart: state => {
      state.progress = PairingProgress.Landing;
    },
  },
});

// functions exposed to react

const controller = new PairingController(fire);

export const joinGameAsync = (gameId: string, playerName: string): AppThunk => dispatch => {
  dispatch(startLoading());
  controller.joinExistingSession(gameId, playerName, result => {
    if (result.isOk()) {
      dispatch(joinGame(result._unsafeUnwrap()))
    }
  });
};

export const startPairingAsync = (playerName: string): AppThunk => dispatch => {
  dispatch(startLoading());
  controller.openNewSession(playerName, result => {
    if (result.isOk()) dispatch(finishPairing(result._unsafeUnwrap()))
  });
};

export const { startLoading, finishPairing, restart, startGame, joinGame } = slice.actions;

export const selectPairingProgress = (state: RootState) => state.pairing.progress;
export const selectPairingPlayers = (state: RootState) => state.pairing.players;
export const selectPairingGameId = (state: RootState) => state.pairing.gameId;

export default slice.reducer;
