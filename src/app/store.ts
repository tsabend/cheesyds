import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import appReducer from "./appSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
  middleware: [thunkMiddleware],
});

store.subscribe(() => {
  const stateString = JSON.stringify(store.getState().app);
  localStorage.setItem("reduxState", stateString);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
