import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./features/authSlice";
import gameReducer from "../features/gameSlice";
// import consoleReducer from "./features/consoleSlice";

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    games: gameReducer,
    // consoles: consoleReducer,
    // tradingPosts: tradingPostReducer,
  },
});
