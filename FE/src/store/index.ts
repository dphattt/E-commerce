"use client";

import { combineReducers, configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import { authReducer, clearSession, setSession, setUser } from "@/features/auth/model/auth.slice";
import { cartApi } from "@/features/cart/api/cart.api";
import { productsReducer } from "@/features/products/model/products.slice";
import { wishlistReducer, setSlugs } from "@/features/wishlist/model/wishlist.slice";
import {
  localPersistStorage,
  sessionPersistStorage,
} from "@/store/persist-storage";

// ── Per-user localStorage helpers (wishlist only) ──────────────────────────
const GUEST_KEY = "guest";

function wishlistKey(userId: string) {
  return `ecommerce-wishlist-${userId}`;
}

function loadWishlistSlugs(userId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(wishlistKey(userId));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveWishlistSlugs(userId: string, slugs: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(wishlistKey(userId), JSON.stringify(slugs));
}

// ── Listener middleware ─────────────────────────────────────────────────────
const listenerMiddleware = createListenerMiddleware();

// setSession (login / register) → lưu wishlist user cũ, load wishlist user mới, reset cart cache
listenerMiddleware.startListening({
  actionCreator: setSession,
  effect(action, api) {
    const originalState = api.getOriginalState() as RootState;
    const prevId = originalState.auth.user?.id ?? GUEST_KEY;

    saveWishlistSlugs(prevId, originalState.wishlist.slugs);

    const newId = action.payload.user.id;
    api.dispatch(setSlugs(loadWishlistSlugs(newId)));
    // Reset cache để RTK Query fetch lại cart của user mới khi skip chuyển false
    api.dispatch(cartApi.util.resetApiState());
  },
});

// setUser (bootstrap) → load wishlist đúng user, cart sẽ tự fetch qua RTK Query
listenerMiddleware.startListening({
  actionCreator: setUser,
  effect(action, api) {
    if (!action.payload) return;
    api.dispatch(setSlugs(loadWishlistSlugs(action.payload.id)));
  },
});

// clearSession (logout) → lưu wishlist, reset cart cache
listenerMiddleware.startListening({
  actionCreator: clearSession,
  effect(_action, api) {
    const originalState = api.getOriginalState() as RootState;
    const userId = originalState.auth.user?.id ?? GUEST_KEY;
    saveWishlistSlugs(userId, originalState.wishlist.slugs);
    // Xóa toàn bộ cart cache khi logout
    api.dispatch(cartApi.util.resetApiState());
  },
});

// Auto-save wishlist mỗi khi thay đổi
listenerMiddleware.startListening({
  predicate: (_action, currentState, previousState) => {
    const cur = currentState as RootState;
    const prev = previousState as RootState;
    return cur.wishlist.slugs !== prev.wishlist.slugs;
  },
  effect(_action, api) {
    const state = api.getState() as RootState;
    const userId = state.auth.user?.id ?? GUEST_KEY;
    saveWishlistSlugs(userId, state.wishlist.slugs);
  },
});

// ── Persist config (products cache only) ──────────────────────────────────
const productsPersistConfig = {
  key: "ecommerce-product-cache",
  version: 1,
  storage: sessionPersistStorage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  [cartApi.reducerPath]: cartApi.reducer,
  products: persistReducer(productsPersistConfig, productsReducer),
  wishlist: wishlistReducer,
});

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          warnAfter: 128,
        },
        immutableCheck: { warnAfter: 128 },
      })
        .prepend(listenerMiddleware.middleware)
        .concat(cartApi.middleware),
  });
}

export const store = makeStore();
export const persistor = persistStore(store);

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];


