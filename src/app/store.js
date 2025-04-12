import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "../features/gameSlice";
import consoleReducer from "../features/consoleSlice";
import authReducer from "../features/authSlice";
import gamePostReducer from "../features/gamePostSlice";
import UsersSlice from "../features/userSlice";
import ConsolePosts from "../features/consolePostSlice";
import gamePostsFilters from "../features/gamePostFilterSlice";
export const store = configureStore({
  reducer: {
    games: gameReducer,
    consoles: consoleReducer,
    auth: authReducer,
    gamePosts: gamePostReducer,
    users: UsersSlice,
    consolePosts: ConsolePosts,
    gamePostsFilterSlice: gamePostsFilters,
  },
});
