import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";
import infoMsgReducer from "../features/infoMsg/msgSlice";
import selectedOptionReducer from "../reducers/selectedOption";
import opcoesFornReducer from "../reducers/opcoesForn";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        infoMsg: infoMsgReducer,
        selectedOption: selectedOptionReducer,
        opcoesForn: opcoesFornReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: false,
});

setupListeners(store.dispatch);
