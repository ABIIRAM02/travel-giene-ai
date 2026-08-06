"use client";

import { Provider } from "react-redux";
import { reduxStore } from "./store";

interface ReduxProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({
  children,
}: ReduxProviderProps) {
  return (
    <Provider store={reduxStore}>
      {children}
    </Provider>
  );
}