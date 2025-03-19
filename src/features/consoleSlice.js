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

// Fetch consoles with optimized pagination
export const fetchConsoles = createAsyncThunk(
  "Consoles/fetch",
  async ({ page = 1, limit: pageLimit = 5 }, { dispatch }) => {
    try {
      // Define both collection references
      const consolesRef = collection(db, "console");
      const newconsolesRef = collection(db, "new_consoles");

      // We'll need to handle pagination differently for combined collections
      if (page === 1 || !pageCache[page - 1]) {
        // For first page or cache miss, we'll need to query both collections and merge
        const consolesQuery = query(
          consolesRef,
          orderBy("name"),
          limit(pageLimit * 2)
        ); // Get extra to merge
        const newconsolesQuery = query(
          newconsolesRef,
          orderBy("name"),
          limit(pageLimit * 2)
        ); // Get extra to merge

        // Execute both queries in parallel
        const [consolesSnapshot, newconsolesSnapshot] = await Promise.all([
          getDocs(consolesQuery),
          getDocs(newconsolesQuery),
        ]);

        // Combine and sort results from both collections
        const allconsoles = [
          ...consolesSnapshot.docs.map((doc) => ({
            id: doc.id,
            source: "console",
            ...doc.data(),
          })),
          ...newconsolesSnapshot.docs.map((doc) => ({
            id: doc.id,
            source: "new_consoles",
            ...doc.data(),
          })),
        ].sort((a, b) => a.name.localeCompare(b.name));

        // Take only what we need for this page
        const currentPageconsoles = allconsoles.slice(0, pageLimit);

        // Cache the last item for pagination
        if (currentPageconsoles.length > 0) {
          const lastGame = currentPageconsoles[currentPageconsoles.length - 1];
          pageCache[page] = {
            name: lastGame.name,
            source: lastGame.source,
          };
        }

        // Reset the filter flag when fetching all consoles
        dispatch(setFilterApplied(false));

        return currentPageconsoles;
      } else {
        // For subsequent pages, use the cached reference point
        const lastCached = pageCache[page - 1];

        // Query both collections but start after our last cached item
        const consolesQuery = query(
          consolesRef,
          orderBy("name"),
          where("name", ">", lastCached.name),
          limit(pageLimit * 2)
        );

        const newconsolesQuery = query(
          newconsolesRef,
          orderBy("name"),
          where("name", ">", lastCached.name),
          limit(pageLimit * 2)
        );

        // Execute both queries in parallel
        const [consolesSnapshot, newconsolesSnapshot] = await Promise.all([
          getDocs(consolesQuery),
          getDocs(newconsolesQuery),
        ]);

        // Combine and sort results from both collections
        const allconsoles = [
          ...consolesSnapshot.docs.map((doc) => ({
            id: doc.id,
            source: "console",
            ...doc.data(),
          })),
          ...newconsolesSnapshot.docs.map((doc) => ({
            id: doc.id,
            source: "new_consoles",
            ...doc.data(),
          })),
        ].sort((a, b) => a.name.localeCompare(b.name));

        // Take only what we need for this page
        const currentPageconsoles = allconsoles.slice(0, pageLimit);

        // Cache the last item for pagination
        if (currentPageconsoles.length > 0) {
          const lastGame = currentPageconsoles[currentPageconsoles.length - 1];
          pageCache[page] = {
            name: lastGame.name,
            source: lastGame.source,
          };
        }

        // Reset the filter flag when fetching all consoles
        dispatch(setFilterApplied(false));

        return currentPageconsoles;
      }
    } catch (error) {
      console.error("Error fetching consoles:", error);
      throw error;
    }
  }
);

// Optimized search functionality across both collections
export const searchConsoles = createAsyncThunk(
  "Consoles/search",
  async (
    { query: searchQuery, page = 1, limit: pageLimit = 5 },
    { dispatch }
  ) => {
    try {
      if (!searchQuery || searchQuery.trim() === "") {
        // Clear search cache when returning to regular fetch
        clearSearchCache();
        return dispatch(fetchConsoles({ page, limit: pageLimit })).unwrap();
      }

      const consolesRef = collection(db, "console");
      const newconsolesRef = collection(db, "new_consoles");
      const normalizedQuery = searchQuery.toLowerCase();

      // Create queries for both collections
      let consolesQuery = query(
        consolesRef,
        where("name", ">=", searchQuery),
        where("name", "<=", searchQuery + "\uf8ff"),
        orderBy("name"),
        limit(pageLimit * 2) // Get extra to merge
      );

      let newconsolesQuery = query(
        newconsolesRef,
        where("name", ">=", searchQuery),
        where("name", "<=", searchQuery + "\uf8ff"),
        orderBy("name"),
        limit(pageLimit * 2) // Get extra to merge
      );

      // If this is a paginated search and we have cache, adjust the queries
      if (page > 1 && pageCache[`search_${normalizedQuery}_${page - 1}`]) {
        const lastCached = pageCache[`search_${normalizedQuery}_${page - 1}`];

        // Update queries with pagination constraints
        consolesQuery = query(
          consolesRef,
          where("name", ">=", searchQuery),
          where("name", "<=", searchQuery + "\uf8ff"),
          orderBy("name"),
          where("name", ">", lastCached.name),
          limit(pageLimit * 2)
        );

        newconsolesQuery = query(
          newconsolesRef,
          where("name", ">=", searchQuery),
          where("name", "<=", searchQuery + "\uf8ff"),
          orderBy("name"),
          where("name", ">", lastCached.name),
          limit(pageLimit * 2)
        );
      }

      // Execute both queries in parallel
      const [consolesSnapshot, newconsolesSnapshot] = await Promise.all([
        getDocs(consolesQuery),
        getDocs(newconsolesQuery),
      ]);

      // Combine and sort results from both collections
      const allconsoles = [
        ...consolesSnapshot.docs.map((doc) => ({
          id: doc.id,
          source: "console",
          ...doc.data(),
        })),
        ...newconsolesSnapshot.docs.map((doc) => ({
          id: doc.id,
          source: "new_consoles",
          ...doc.data(),
        })),
      ].sort((a, b) => a.name.localeCompare(b.name));

      // Take only what we need for this page
      const currentPageconsoles = allconsoles.slice(0, pageLimit);

      // Cache the last item for pagination
      if (currentPageconsoles.length > 0) {
        const lastGame = currentPageconsoles[currentPageconsoles.length - 1];
        pageCache[`search_${normalizedQuery}_${page}`] = {
          name: lastGame.name,
          source: lastGame.source,
        };
      }

      // Set flags in state
      dispatch(setFilterApplied(true));
      dispatch(setSearchQuery(searchQuery));

      // Calculate total count for both collections combined
      const consolesCountQuery = query(
        consolesRef,
        where("name", ">=", searchQuery),
        where("name", "<=", searchQuery + "\uf8ff")
      );

      const newconsolesCountQuery = query(
        newconsolesRef,
        where("name", ">=", searchQuery),
        where("name", "<=", searchQuery + "\uf8ff")
      );

      const [consolesCount, newconsolesCount] = await Promise.all([
        getCountFromServer(consolesCountQuery),
        getCountFromServer(newconsolesCountQuery),
      ]);

      const total = consolesCount.data().count + newconsolesCount.data().count;

      // Calculate total pages
      const totalPages = Math.ceil(total / pageLimit);
      dispatch(setTotalPages(totalPages));

      // Return both the data and the total for easier state updates
      return {
        items: currentPageconsoles,
        total,
      };
    } catch (error) {
      console.error("Error searching consoles:", error);
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
export const fetchTotalConsolesCount = createAsyncThunk(
  "Consoles/fetchTotalCount",
  async (_, { getState }) => {
    try {
      const { initialFetchDone } = getState().consoles;
      // Use cached value if available
      if (initialFetchDone) return getState().consoles.totalconsoles;

      const consolesRef = collection(db, "console");
      const newconsolesRef = collection(db, "new_consoles");

      // Get counts from both collections
      const [consolesCount, newconsolesCount] = await Promise.all([
        getCountFromServer(consolesRef),
        getCountFromServer(newconsolesRef),
      ]);

      // Return sum of both counts
      return consolesCount.data().count + newconsolesCount.data().count;
    } catch (error) {
      console.error("Error fetching game count:", error);
      throw error;
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading, initialFetchDone } = getState().consoles;
      return !loading || !initialFetchDone;
    },
  }
);
// Add a new game
export const addConsole = createAsyncThunk(
  "Consoles/add",
  async (game, { dispatch, getState }) => {
    try {
      // Add only to new_consoles collection
      const gameData = {
        name: game.name,
      };

      // Add to new_consoles collection
      const docRef = await addDoc(collection(db, "new_consoles"), gameData);
      const newGame = { id: docRef.id, source: "new_consoles", ...gameData };

      // Clear cache to ensure fresh data
      Object.keys(pageCache).forEach((key) => delete pageCache[key]);

      // Update total count
      dispatch(fetchTotalConsolesCount());

      // Refresh the current page
      const { currentPage, consolesPerPage, filterApplied, searchQuery } =
        getState().consoles;
      if (filterApplied) {
        dispatch(
          searchConsoles({
            query: searchQuery,
            page: currentPage,
            limit: consolesPerPage,
          })
        );
      } else {
        dispatch(fetchConsoles({ page: currentPage, limit: consolesPerPage }));
      }
      return newGame;
    } catch (error) {
      console.error("Error adding game:", error);
      throw error;
    }
  }
);

// Delete a game
export const deleteConsole = createAsyncThunk(
  "Consoles/delete",
  async (id, { dispatch, getState }) => {
    try {
      // First check if the game exists in consoles collection
      const consolesDocRef = doc(db, "console", id);
      const consolesDocSnap = await getDoc(consolesDocRef);

      if (consolesDocSnap.exists()) {
        // Game found in consoles collection, delete it
        await deleteDoc(consolesDocRef);
      } else {
        // Game not found in consoles collection, try new_consoles
        const newconsolesDocRef = doc(db, "new_consoles", id);
        await deleteDoc(newconsolesDocRef);
      }

      // Clear cache to ensure fresh data
      Object.keys(pageCache).forEach((key) => delete pageCache[key]);

      // Update total pages after deleting
      dispatch(fetchTotalConsolesCount());

      // Check if we need to go to previous page
      const {
        currentPage,
        consolesPerPage,
        items,
        filterApplied,
        searchQuery,
      } = getState().consoles;
      if (items.length === 1 && currentPage > 1) {
        dispatch(setCurrentPage(currentPage - 1));
      }

      // Refresh the current page
      if (filterApplied) {
        dispatch(
          searchConsoles({
            query: searchQuery,
            page: currentPage,
            limit: consolesPerPage,
          })
        );
      } else {
        dispatch(fetchConsoles({ page: currentPage, limit: consolesPerPage }));
      }
      return id;
    } catch (error) {
      console.error("Error deleting game:", error);
      throw error;
    }
  }
);

// Update a game
export const updateConsole = createAsyncThunk(
  "Consoles/update",
  async ({ id, source, ...gameData }, { dispatch, getState }) => {
    try {
      const updatedData = {
        ...gameData,
        name: gameData.name,
      };

      // Determine which collection to update based on source
      if (source === "console") {
        // Update in consoles collection
        const gameRef = doc(db, "console", id);
        await updateDoc(gameRef, updatedData);
      } else if (source === "new_consoles") {
        // Update in new_consoles collection
        const gameRef = doc(db, "new_consoles", id);
        await updateDoc(gameRef, updatedData);
      } else {
        // If source is not provided, try to update in both collections
        let updatedInconsoles = false;
        let updatedInNewconsoles = false;

        try {
          // Try to update in consoles collection
          const gameRef = doc(db, "console", id);
          const consolesnapshot = await getDoc(gameRef);

          if (consolesnapshot.exists()) {
            await updateDoc(gameRef, updatedData);
            updatedInconsoles = true;
          }
        } catch (error) {
          console.log("Failed to update in consoles collection", error);
        }

        try {
          // Try to update in new_consoles collection
          const newGameRef = doc(db, "new_consoles", id);
          const newconsolesnapshot = await getDoc(newGameRef);

          if (newconsolesnapshot.exists()) {
            await updateDoc(newGameRef, updatedData);
            updatedInNewconsoles = true;
          }
        } catch (error) {
          console.log("Failed to update in new_consoles collection", error);
        }

        if (!updatedInconsoles && !updatedInNewconsoles) {
          throw new Error("Game not found in either collection");
        }
      }

      // Clear cache for the affected pages
      Object.keys(pageCache).forEach((key) => delete pageCache[key]);

      // Refresh the current page
      const { currentPage, consolesPerPage, filterApplied, searchQuery } =
        getState().consoles;
      if (filterApplied) {
        dispatch(
          searchConsoles({
            query: searchQuery,
            page: currentPage,
            limit: consolesPerPage,
          })
        );
      } else {
        dispatch(fetchConsoles({ page: currentPage, limit: consolesPerPage }));
      }
      return { id, source, ...updatedData };
    } catch (error) {
      console.error("Error updating game:", error);
      throw error;
    }
  }
);

const consoleslice = createSlice({
  name: "consoles",
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    consolesPerPage: 5,
    totalconsoles: 0,
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
        : state.totalconsoles;
      state.totalPages = Math.ceil(count / state.consolesPerPage);
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
      state.totalPages = Math.ceil(action.payload / state.consolesPerPage);
    },
    clearPaginationCache: () => {
      // Clear the cache outside of state when needed
      Object.keys(pageCache).forEach((key) => delete pageCache[key]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConsoles.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.filterApplied = false;
      })
      .addCase(fetchConsoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsoles.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(searchConsoles.fulfilled, (state, action) => {
        if (action.payload) {
          // If the payload has the expected structure
          if (action.payload.items) {
            state.items = action.payload.items;

            // If total is provided, update totalPages
            if (action.payload.total !== undefined) {
              state.totalPages = Math.ceil(
                action.payload.total / state.consolesPerPage
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
      .addCase(searchConsoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchConsoles.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchTotalConsolesCount.fulfilled, (state, action) => {
        state.totalconsoles = action.payload;
        // Only update total pages if we're not in a filtered state
        if (!state.filterApplied) {
          state.totalPages = Math.ceil(action.payload / state.consolesPerPage);
        }
        state.initialFetchDone = true;
        state.loading = false;
      })
      .addCase(fetchTotalConsolesCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addConsole.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.totalconsoles++;
      })
      .addCase(deleteConsole.fulfilled, (state, action) => {
        state.items = state.items.filter((game) => game.id !== action.payload);
        state.totalconsoles--;
      })
      .addCase(updateConsole.fulfilled, (state, action) => {
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
} = consoleslice.actions;

export default consoleslice.reducer;
