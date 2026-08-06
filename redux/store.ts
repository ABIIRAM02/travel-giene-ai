import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers/root-reducer";

export const reduxStore = configureStore({
  reducer: rootReducer,
});

export type AppSelector = ReturnType<typeof reduxStore.getState>;

export type AppDispatch = typeof reduxStore.dispatch;

export type AppStore = typeof reduxStore;