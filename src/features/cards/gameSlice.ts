import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import { Game, GameBuilder } from "../../app/game"
import { Card } from "../../app/card"
import { Turn } from "../../app/turn"
interface GameState {
  game: Game;
  turn: Turn;
}

// in case special construction logic is needed
const makeInitialState = () => {
  return {
     game: new GameBuilder().makeFakeGame(),
     turn: new Turn(),
  };
}
const initialState: GameState = makeInitialState();

export const slice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    submit: state => {
      state.game = state.game.submit(state.turn.cardsToSubmit);
      state.turn = new Turn(state.game.topOfInPlayPile()?.faceValue);
    },
    selectCard: (state, card: PayloadAction<Card>) => {
      state.turn = state.turn.selectCard(card.payload);
    },
    pickUp: state => {
      state.game = state.game.pickUp();
      state.turn = new Turn();
    }
  },
});

export const { submit, selectCard, pickUp } = slice.actions;


export const selectGame = (state: RootState) => state.game.game;
export const selectTurn = (state: RootState) => state.game.turn;

export default slice.reducer;
