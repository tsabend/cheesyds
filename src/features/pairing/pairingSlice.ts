import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as generateUUID } from "uuid";
import { AppThunk, RootState } from '../../app/store';
// import { fire } from './app/fire';

export enum PairingProgress {
  Landing,
  Waiting,
  Joining,
}

export interface PairingState {
  progress: PairingProgress,
  players: Array<string>,
  gameId: string,
}

// in case special construction logic is needed
const makeInitialState = () => {
  return {
    progress: PairingProgress.Landing,
    players: [],
    gameId: generateUUID(),
  };
}
const initialState: PairingState = makeInitialState();

export const slice = createSlice({
  name: 'pairing',
  initialState,
  reducers: {
    startPairing: (state, playerName: PayloadAction<string>) => {
      state.players.push(playerName.payload);
      state.progress = PairingProgress.Waiting;
      state.gameId = generateUUID().slice(0,4).toUpperCase();
    },
    joinGame: (state: PairingState, action: PayloadAction<JoinAction>) => {
      state.progress = PairingProgress.Joining;
      state.gameId = action.payload.gameId;
      // this will go away
      state.players.push(action.payload.playerName);
    },
    startGame: state => {
      console.log("BUILD THE GAME NOW");
    },
    restart: state => {
      state.progress = PairingProgress.Landing;
    },
  },
});


// // The function below is called a thunk and allows us to perform async logic. It
// // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// // will call the thunk with the `dispatch` function as the first argument. Async
// // code can then be executed and other actions can be dispatched
export const joinGameAsync = (action: JoinAction): AppThunk => dispatch => {
  setTimeout(() => {
    dispatch(joinGame(action));
  }, 1000);
};

export interface JoinAction {
  gameId: string,
  playerName: string,
}

export const { startPairing, restart, startGame, joinGame } = slice.actions;

export const selectPairingProgress = (state: RootState) => state.pairing.progress;
export const selectPairingPlayers = (state: RootState) => state.pairing.players;
export const selectPairingGameId = (state: RootState) => state.pairing.gameId;

export default slice.reducer;
