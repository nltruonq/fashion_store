import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartSlice from "./toolkits/cartSlice";
import orderSlice from "./toolkits/orderSlice";
import productSlice from "./toolkits/productSlice";
import userSlice from "./toolkits/userSlice";
import notificationSlice from "./toolkits/notificationSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userAdminSlice from "./toolkits/userAdminSlice";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["userState"],
};

const reducers = combineReducers({
    userState: userSlice,
    productState: productSlice,
    orderState: orderSlice,
    cartState: cartSlice,
    userAdminState: userAdminSlice,
    notificationState: notificationSlice,
});

const persistedReducer = persistReducer(persistConfig, reducers);
export const store = configureStore({
    reducer: persistedReducer,
    // reducer: {
    //   userState: userSlice,
    //   productState: productSlice,
    //   orderState: orderSlice,
    //   cartState: cartSlice,
    //   userAdminState: userAdminSlice
    // },
    middleware: (gDM) =>
        gDM({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
