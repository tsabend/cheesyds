import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
// import { fire } from './app/fire';

export enum PairingProgress {
  Landing
}

export interface PairingState {
  progress: PairingProgress,
}

// in case special construction logic is needed
const makeInitialState = () => {
  return {
    progress: PairingProgress.Landing
  };
}
const initialState: PairingState = makeInitialState();

export const slice = createSlice({
  name: 'pairing',
  initialState,
  reducers: {
    create: state => {

    },
  },
});

export const { create } = slice.actions;

export const selectPairingProgress = (state: RootState) => state.pairing.progress;

export default slice.reducer;
