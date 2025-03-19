import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  limit,
  orderBy,
  where,
  getCountFromServer,
} from "firebase/firestore";

// Store the last document for each page to enable efficient pagination
const pageCache = {};

// Fetch games with optimized pagination
export const fetchGames = createAsyncThunk(
  "Games/fetch",
  async ({ page = 1, limit: pageLimit = 5 }, { dispatch }) => {
    try {
      // Define both collection references
      const gamesRef = collection(db, "Games");
      const newGamesRef = collection(db, "new_games");

      // We'll need to handle pagination differently for combined collections
      if (page === 1 || !pageCache[page - 1]) {
        // For first page or cache miss, we'll need to query both collections and merge
        const gamesQuery = query(
          gamesRef,
          orderBy("name"),
          limit(pageLimit * 2)
        ); // Get extra to merge
        const newGamesQuery = query(
          newGamesRef,
          orderBy("name"),
          limit(pageLimit * 2)
        ); // Get extra to merge

        // Execute both queries in parallel
        const [gamesSnapshot, newGamesSnapshot] = await Promise.all([
          getDocs(gamesQuery),
          getDocs(newGamesQuery),
        ]);

        // Combine and sort results from both collections
        const allGames = [
          ...gamesSnapshot.docs.map((doc) => ({
            id: doc.id,
            source: "Games",
            ...doc.data(),
          })),
          ...newGamesSnapshot.docs.map((doc) => ({
            id: doc.id,
            source: "new_games",
            ...doc.data(),
          })),
        ].sort((a, b) => a.name.localeCompare(b.name));

        // Take only what we need for this page
        const currentPageGames = allGames.slice(0, pageLimit);

        // Cache the last item for pagination
        if (currentPageGames.length > 0) {
          const lastGame = currentPageGames[currentPageGames.length - 1];
          pageCache[page] = {
            name: lastGame.name,
            source: lastGame.source,
          };
        }

        // Reset the filter flag when fetching all games
        dispatch(setFilterApplied(false));

        return currentPageGames;
      } else {
        // For subsequent pages, use the cached reference point
        const lastCached = pageCache[page - 1];

        // Query both collections but start after our last cached item
        const gamesQuery = query(
          gamesRef,
          orderBy("name"),
          where("name", ">", lastCached.name),
          limit(pageLimit * 2)
        );

        const newGamesQuery = query(
          newGamesRef,
          orderBy("name"),
          where("name", ">", lastCached.name),
          limit(pageLimit * 2)
        );

        // Execute both queries in parallel
        const [gamesSnapshot, newGamesSnapshot] = await Promise.all([
          getDocs(gamesQuery),
          getDocs(newGamesQuery),
        ]);

        // Combine and sort results from both collections
        const allGames = [
          ...gamesSnapshot.docs.map((doc) => ({
            id: doc.id,
            source: "Games",
            ...doc.data(),
          })),
          ...newGamesSnapshot.docs.map((doc) => ({
            id: doc.id,
            source: "new_games",
            ...doc.data(),
          })),
        ].sort((a, b) => a.name.localeCompare(b.name));

        // Take only what we need for this page
        const currentPageGames = allGames.slice(0, pageLimit);

        // Cache the last item for pagination
        if (currentPageGames.length > 0) {
          const lastGame = currentPageGames[currentPageGames.length - 1];
          pageCache[page] = {
            name: lastGame.name,
            source: lastGame.source,
          };
        }

        // Reset the filter flag when fetching all games
        dispatch(setFilterApplied(false));

        return currentPageGames;
      }
    } catch (error) {
      console.error("Error fetching games:", error);
      throw error;
    }
  }
);

// Optimized search functionality across both collections
export const searchGames = createAsyncThunk(
  "Games/search",
  async (
    { query: searchQuery, page = 1, limit: pageLimit = 5 },
    { dispatch }
  ) => {
    try {
      if (!searchQuery || searchQuery.trim() === "") {
        // Clear search cache when returning to regular fetch
        clearSearchCache();
        return dispatch(fetchGames({ page, limit: pageLimit })).unwrap();
      }

      const gamesRef = collection(db, "Games");
      const newGamesRef = collection(db, "new_games");
      const normalizedQuery = searchQuery.toLowerCase();

      // Create queries for both collections
      let gamesQuery = query(
        gamesRef,
        where("name", ">=", searchQuery),
        where("name", "<=", searchQuery + "\uf8ff"),
        orderBy("name"),
        limit(pageLimit * 2) // Get extra to merge
      );

      let newGamesQuery = query(
        newGamesRef,
        where("name", ">=", searchQuery),
        where("name", "<=", searchQuery + "\uf8ff"),
        orderBy("name"),
        limit(pageLimit * 2) // Get extra to merge
      );

      // If this is a paginated search and we have cache, adjust the queries
      if (page > 1 && pageCache[`search_${normalizedQuery}_${page - 1}`]) {
        const lastCached = pageCache[`search_${normalizedQuery}_${page - 1}`];

        // Update queries with pagination constraints
        gamesQuery = query(
          gamesRef,
          where("name", ">=", searchQuery),
          where("name", "<=", searchQuery + "\uf8ff"),
          orderBy("name"),
          where("name", ">", lastCached.name),
          limit(pageLimit * 2)
        );

        newGamesQuery = query(
          newGamesRef,
          where("name", ">=", searchQuery),
          where("name", "<=", searchQuery + "\uf8ff"),
          orderBy("name"),
          where("name", ">", lastCached.name),
          limit(pageLimit * 2)
        );
      }

      // Execute both queries in parallel
      const [gamesSnapshot, newGamesSnapshot] = await Promise.all([
        getDocs(gamesQuery),
        getDocs(newGamesQuery),
      ]);

      // Combine and sort results from both collections
      const allGames = [
        ...gamesSnapshot.docs.map((doc) => ({
          id: doc.id,
          source: "Games",
          ...doc.data(),
        })),
        ...newGamesSnapshot.docs.map((doc) => ({
          id: doc.id,
          source: "new_games",
          ...doc.data(),
        })),
      ].sort((a, b) => a.name.localeCompare(b.name));

      // Take only what we need for this page
      const currentPageGames = allGames.slice(0, pageLimit);

      // Cache the last item for pagination
      if (currentPageGames.length > 0) {
        const lastGame = currentPageGames[currentPageGames.length - 1];
        pageCache[`search_${normalizedQuery}_${page}`] = {
          name: lastGame.name,
          source: lastGame.source,
        };
      }

      // Set flags in state
      dispatch(setFilterApplied(true));
      dispatch(setSearchQuery(searchQuery));

      // Calculate total count for both collections combined
      const gamesCountQuery = query(
        gamesRef,
        where("name", ">=", searchQuery),
        where("name", "<=", searchQuery + "\uf8ff")
      );

      const newGamesCountQuery = query(
        newGamesRef,
        where("name", ">=", searchQuery),
        where("name", "<=", searchQuery + "\uf8ff")
      );

      const [gamesCount, newGamesCount] = await Promise.all([
        getCountFromServer(gamesCountQuery),
        getCountFromServer(newGamesCountQuery),
      ]);

      const total = gamesCount.data().count + newGamesCount.data().count;

      // Calculate total pages
      const totalPages = Math.ceil(total / pageLimit);
      dispatch(setTotalPages(totalPages));

      // Return both the data and the total for easier state updates
      return {
        items: currentPageGames,
        total,
      };
    } catch (error) {
      console.error("Error searching games:", error);
      throw error;
    }
  }
);

// Helper function to clear search cache
function clearSearchCache() {
  Object.keys(pageCache).forEach((key) => {
    if (key.startsWith("search_")) {
      delete pageCache[key];
    }
  });
}

// Fetch the total count from both collections
export const fetchTotalGamesCount = createAsyncThunk(
  "Games/fetchTotalCount",
  async (_, { getState }) => {
    try {
      const { initialFetchDone } = getState().games;
      // Use cached value if available
      if (initialFetchDone) return getState().games.totalGames;

      const gamesRef = collection(db, "Games");
      const newGamesRef = collection(db, "new_games");

      // Get counts from both collections
      const [gamesCount, newGamesCount] = await Promise.all([
        getCountFromServer(gamesRef),
        getCountFromServer(newGamesRef),
      ]);

      // Return sum of both counts
      return gamesCount.data().count + newGamesCount.data().count;
    } catch (error) {
      console.error("Error fetching game count:", error);
      throw error;
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading, initialFetchDone } = getState().games;
      return !loading || !initialFetchDone;
    },
  }
);
// Add a new game
export const addGame = createAsyncThunk(
  "Games/add",
  async (game, { dispatch, getState }) => {
    try {
      // Add only to new_games collection
      const gameData = {
        name: game.name,
      };

      // Add to new_games collection
      const docRef = await addDoc(collection(db, "new_games"), gameData);
      const newGame = { id: docRef.id, source: "new_games", ...gameData };

      // Clear cache to ensure fresh data
      Object.keys(pageCache).forEach((key) => delete pageCache[key]);

      // Update total count
      dispatch(fetchTotalGamesCount());

      // Refresh the current page
      const { currentPage, gamesPerPage, filterApplied, searchQuery } =
        getState().games;
      if (filterApplied) {
        dispatch(
          searchGames({
            query: searchQuery,
            page: currentPage,
            limit: gamesPerPage,
          })
        );
      } else {
        dispatch(fetchGames({ page: currentPage, limit: gamesPerPage }));
      }
      return newGame;
    } catch (error) {
      console.error("Error adding game:", error);
      throw error;
    }
  }
);

// Delete a game
export const deleteGame = createAsyncThunk(
  "Games/delete",
  async (id, { dispatch, getState }) => {
    try {
      // First check if the game exists in Games collection
      const gamesDocRef = doc(db, "Games", id);
      const gamesDocSnap = await getDoc(gamesDocRef);

      if (gamesDocSnap.exists()) {
        // Game found in Games collection, delete it
        await deleteDoc(gamesDocRef);
      } else {
        // Game not found in Games collection, try new_games
        const newGamesDocRef = doc(db, "new_games", id);
        await deleteDoc(newGamesDocRef);
      }

      // Clear cache to ensure fresh data
      Object.keys(pageCache).forEach((key) => delete pageCache[key]);

      // Update total pages after deleting
      dispatch(fetchTotalGamesCount());

      // Check if we need to go to previous page
      const { currentPage, gamesPerPage, items, filterApplied, searchQuery } =
        getState().games;
      if (items.length === 1 && currentPage > 1) {
        dispatch(setCurrentPage(currentPage - 1));
      }

      // Refresh the current page
      if (filterApplied) {
        dispatch(
          searchGames({
            query: searchQuery,
            page: currentPage,
            limit: gamesPerPage,
          })
        );
      } else {
        dispatch(fetchGames({ page: currentPage, limit: gamesPerPage }));
      }
      return id;
    } catch (error) {
      console.error("Error deleting game:", error);
      throw error;
    }
  }
);

// Update a game
export const updateGame = createAsyncThunk(
  "Games/update",
  async ({ id, source, ...gameData }, { dispatch, getState }) => {
    try {
      const updatedData = {
        ...gameData,
        name: gameData.name,
      };

      // Determine which collection to update based on source
      if (source === "Games") {
        // Update in Games collection
        const gameRef = doc(db, "Games", id);
        await updateDoc(gameRef, updatedData);
      } else if (source === "new_games") {
        // Update in new_games collection
        const gameRef = doc(db, "new_games", id);
        await updateDoc(gameRef, updatedData);
      } else {
        // If source is not provided, try to update in both collections
        let updatedInGames = false;
        let updatedInNewGames = false;

        try {
          // Try to update in Games collection
          const gameRef = doc(db, "Games", id);
          const gameSnapshot = await getDoc(gameRef);

          if (gameSnapshot.exists()) {
            await updateDoc(gameRef, updatedData);
            updatedInGames = true;
          }
        } catch (error) {
          console.log("Failed to update in Games collection", error);
        }

        try {
          // Try to update in new_games collection
          const newGameRef = doc(db, "new_games", id);
          const newGameSnapshot = await getDoc(newGameRef);

          if (newGameSnapshot.exists()) {
            await updateDoc(newGameRef, updatedData);
            updatedInNewGames = true;
          }
        } catch (error) {
          console.log("Failed to update in new_games collection", error);
        }

        if (!updatedInGames && !updatedInNewGames) {
          throw new Error("Game not found in either collection");
        }
      }

      // Clear cache for the affected pages
      Object.keys(pageCache).forEach((key) => delete pageCache[key]);

      // Refresh the current page
      const { currentPage, gamesPerPage, filterApplied, searchQuery } =
        getState().games;
      if (filterApplied) {
        dispatch(
          searchGames({
            query: searchQuery,
            page: currentPage,
            limit: gamesPerPage,
          })
        );
      } else {
        dispatch(fetchGames({ page: currentPage, limit: gamesPerPage }));
      }
      return { id, source, ...updatedData };
    } catch (error) {
      console.error("Error updating game:", error);
      throw error;
    }
  }
);

const gameSlice = createSlice({
  name: "Games",
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    gamesPerPage: 5,
    totalGames: 0,
    searchResultsCount: 0,
    initialFetchDone: false,
    searchQuery: "",
    filterApplied: false,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state) => {
      const count = state.filterApplied
        ? state.searchResultsCount
        : state.totalGames;
      state.totalPages = Math.ceil(count / state.gamesPerPage);
    },
    resetState: (state) => {
      state.loading = false;
      state.error = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilterApplied: (state, action) => {
      state.filterApplied = action.payload;
    },
    setSearchResultsCount: (state, action) => {
      state.searchResultsCount = action.payload;
      // Update total pages based on search results
      state.totalPages = Math.ceil(action.payload / state.gamesPerPage);
    },
    clearPaginationCache: () => {
      // Clear the cache outside of state when needed
      Object.keys(pageCache).forEach((key) => delete pageCache[key]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.filterApplied = false;
      })
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(searchGames.fulfilled, (state, action) => {
        if (action.payload) {
          // If the payload has the expected structure
          if (action.payload.items) {
            state.items = action.payload.items;

            // If total is provided, update totalPages
            if (action.payload.total !== undefined) {
              state.totalPages = Math.ceil(
                action.payload.total / state.gamesPerPage
              );
            }
          } else {
            // Fallback for backward compatibility
            state.items = action.payload;
          }
        }
        state.loading = false;
        state.initialFetchDone = true;
      })
      .addCase(searchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchGames.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchTotalGamesCount.fulfilled, (state, action) => {
        state.totalGames = action.payload;
        // Only update total pages if we're not in a filtered state
        if (!state.filterApplied) {
          state.totalPages = Math.ceil(action.payload / state.gamesPerPage);
        }
        state.initialFetchDone = true;
        state.loading = false;
      })
      .addCase(fetchTotalGamesCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGame.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.totalGames++;
      })
      .addCase(deleteGame.fulfilled, (state, action) => {
        state.items = state.items.filter((game) => game.id !== action.payload);
        state.totalGames--;
      })
      .addCase(updateGame.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (game) => game.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const {
  setCurrentPage,
  setTotalPages,
  resetState,
  setSearchQuery,
  setFilterApplied,
  setSearchResultsCount,
  clearPaginationCache,
} = gameSlice.actions;

export default gameSlice.reducer;
