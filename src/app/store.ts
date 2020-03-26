import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import thunkMiddleware from 'redux-thunk'

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
  middleware: [thunkMiddleware]
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
