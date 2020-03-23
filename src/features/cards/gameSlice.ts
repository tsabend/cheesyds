import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import { GameController, GameSnapshot, GameBuilder } from "../../app/game"
import { Card } from "../../app/card"
import { Turn } from "../../app/turn"
interface GameState {
  controller: GameController;
  snapshot: GameSnapshot;
  turn: Turn;
}

// in case special construction logic is needed
const makeInitialState = () => {
  const snapshot = new GameBuilder().makeFakeGame();
  const controller = new GameController();
  const initial = controller.deal(snapshot);
  return {
     controller: controller,
     snapshot: initial,
     turn: new Turn(),
  };
}
const initialState: GameState = makeInitialState();

export const slice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    submit: state => {
      const newSnapshot = state.controller.submit(state.turn.cardsToSubmit);
      state.snapshot = newSnapshot;
      state.turn = new Turn(state.controller.topOfInPlayPile(newSnapshot)?.faceValue);
    },
    selectCard: (state, card: PayloadAction<Card>) => {
      state.turn = state.turn.selectCard(card.payload);
    },
    pickUp: state => {
      state.snapshot = state.controller.pickUp(snapshot);
      state.turn = new Turn();
    }
  },
});

export const { submit, selectCard, pickUp } = slice.actions;


export const selectGame = (state: RootState) => state.game.game;
export const selectTurn = (state: RootState) => state.game.turn;

export default slice.reducer;
