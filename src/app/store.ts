import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import gameReducer from '../features/cards/gameSlice';
import pairingReducer from '../features/pairing/pairingSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    pairing: pairingReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
