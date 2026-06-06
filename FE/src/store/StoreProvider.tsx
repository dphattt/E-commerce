"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AuthSessionBootstrap } from "@/features/auth/model/AuthSessionBootstrap";
import { WishlistBootstrap } from "@/features/wishlist/model/WishlistBootstrap";
import { WishlistLoginPromptProvider } from "@/features/wishlist/model/WishlistLoginPrompt";
import { persistor, store } from "@/store";

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WishlistLoginPromptProvider>
          <AuthSessionBootstrap />
          <WishlistBootstrap />
          {children}
        </WishlistLoginPromptProvider>
      </PersistGate>
    </Provider>
  );
}
