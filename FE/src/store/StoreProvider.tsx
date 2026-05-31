"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AuthSessionBootstrap } from "@/features/auth/model/AuthSessionBootstrap";
import { persistor, store } from "@/store";

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthSessionBootstrap />
        {children}
      </PersistGate>
    </Provider>
  );
}
