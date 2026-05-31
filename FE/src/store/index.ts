"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
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
import { authReducer } from "@/features/auth/model/auth.slice";
import { cartReducer } from "@/features/cart/model/cart.slice";
import { productsReducer } from "@/features/products/model/products.slice";
import { wishlistReducer } from "@/features/wishlist/model/wishlist.slice";
import {
  localPersistStorage,
  sessionPersistStorage,
} from "@/store/persist-storage";

const cartPersistConfig = {
  key: "ecommerce-cart",
  version: 1,
  storage: localPersistStorage,
};

const wishlistPersistConfig = {
  key: "ecommerce-wishlist",
  version: 1,
  storage: localPersistStorage,
};

const productsPersistConfig = {
  key: "ecommerce-product-cache",
  version: 1,
  storage: sessionPersistStorage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
  products: persistReducer(productsPersistConfig, productsReducer),
  wishlist: persistReducer(wishlistPersistConfig, wishlistReducer),
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
      }),
  });
}

export const store = makeStore();
export const persistor = persistStore(store);

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
