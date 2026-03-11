import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";

import addressReducer  from "./addressSlice";
import userInfoReducer from "./userInfoSlice";
import paymentReducer from "./paymentSlice";

const rootReducer = combineReducers({
  address:  addressReducer,
  userInfo: userInfoReducer,
  payment: paymentReducer,
});

const persistConfig = {
  key:       "ecoyaan",
  storage,
  whitelist: ["address", "userInfo", "payment"], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);