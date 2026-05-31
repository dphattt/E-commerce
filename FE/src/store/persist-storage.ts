import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import type { Storage } from "redux-persist";

function createNoopStorage(): Storage {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
}

function createBrowserStorage(type: "local" | "session"): Storage {
  if (typeof window === "undefined") {
    return createNoopStorage();
  }
  return createWebStorage(type);
}

export const localPersistStorage = createBrowserStorage("local");
export const sessionPersistStorage = createBrowserStorage("session");
