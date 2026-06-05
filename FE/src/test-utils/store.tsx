import { combineReducers, configureStore } from "@reduxjs/toolkit";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { authReducer } from "@/features/auth/model/auth.slice";
import { productsReducer } from "@/features/products/model/products.slice";
import { wishlistReducer } from "@/features/wishlist/model/wishlist.slice";

const testRootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  wishlist: wishlistReducer,
});

export type TestRootState = ReturnType<typeof testRootReducer>;

const emptyTestState: TestRootState = {
  auth: { user: null },
  products: { bySlug: {} },
  wishlist: { slugs: [] },
};

export function createTestStore(overrides?: Partial<TestRootState>) {
  return configureStore({
    reducer: testRootReducer,
    preloadedState: { ...emptyTestState, ...overrides },
  });
}

export function TestStoreProvider({
  children,
  preloadedState,
}: {
  children: ReactNode;
  preloadedState?: Partial<TestRootState>;
}) {
  const store = createTestStore(preloadedState);
  return <Provider store={store}>{children}</Provider>;
}
