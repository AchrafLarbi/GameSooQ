import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  limit,
  startAfter,
  orderBy,
  where,
  getCountFromServer,
} from "firebase/firestore";

// Store the last document for each page to enable efficient pagination
const pageCache = {};

// Fetch games with optimized pagination
export const fetchConsoles = createAsyncThunk(
  "Consoles/fetch",
  async ({ page = 1, limit: pageLimit = 5 }, { dispatch }) => {
    try {
      const gamesRef = collection(db, "console");
      let q;

      // If we have a cached reference for this page, use it for efficient pagination
      if (page > 1 && pageCache[page - 1]) {
        q = query(
          gamesRef,
          orderBy("name"),
          startAfter(pageCache[page - 1]),
          limit(pageLimit)
        );
      } else if (page === 1) {
        // First page is simple
        q = query(gamesRef, orderBy("name"), limit(pageLimit));
      } else {
        // Fallback for uncached pages (should be rare)
        console.warn(`Page ${page} not in cache, fetching from beginning`);
        q = query(gamesRef, orderBy("name"), limit(page * pageLimit));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return [];

        // Get just the last batch
        const allDocs = snapshot.docs;
        const startIndex = (page - 1) * pageLimit;

        // Cache documents for future use
        for (let i = 0; i < Math.min(page, allDocs.length / pageLimit); i++) {
          const cacheIndex = i * pageLimit + pageLimit - 1;
          if (cacheIndex < allDocs.length) {
            pageCache[i + 1] = allDocs[cacheIndex];
          }
        }

        // Return only the current page
        return allDocs
          .slice(startIndex, startIndex + pageLimit)
          .map((doc) => ({ id: doc.id, ...doc.data() }));
      }

      const snapshot = await getDocs(q);

      // Cache the last document for pagination
      if (snapshot.docs.length > 0) {
        pageCache[page] = snapshot.docs[snapshot.docs.length - 1];
      }

      // Reset the filter flag when fetching all games
      dispatch(setFilterApplied(false));

      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching consoles:", error);
      throw error;
    }
  }
);

// Optimized search functionality
export const searchConsoles = createAsyncThunk(
  "Consoles/search",
  async (
    { query: searchQuery, page = 1, limit: pageLimit = 10 },
    { dispatch }
  ) => {
    try {
      if (!searchQuery || searchQuery.trim() === "") {
        // Clear search cache when returning to regular fetch
        clearSearchCache();
        return dispatch(fetchConsoles({ page, limit: pageLimit })).unwrap();
      }

      const gamesRef = collection(db, "console");
      const normalizedQuery = searchQuery.toLowerCase();
      let q;

      // First page or no cache
      if (page === 1 || !pageCache[`search_${normalizedQuery}_${page - 1}`]) {
        q = query(
          gamesRef,
          where("name", ">=", searchQuery),
          where("name", "<=", searchQuery + "\uf8ff"),
          orderBy("name"),
          limit(pageLimit)
        );
      } else {
        // For subsequent pages, use the startAfter with the cached document
        const lastDoc = pageCache[`search_${normalizedQuery}_${page - 1}`];
        q = query(
          gamesRef,
          where("name", ">=", searchQuery),
          where("name", "<=", searchQuery + "\uf8ff"),
          orderBy("name"),
          startAfter(lastDoc),
          limit(pageLimit)
        );
      }

      const snapshot = await getDocs(q);

      // Cache the last document for pagination
      if (snapshot.docs.length > 0) {
        pageCache[`search_${normalizedQuery}_${page}`] =
          snapshot.docs[snapshot.docs.length - 1];
      }

      // Set flags in state
      dispatch(setFilterApplied(true));
      dispatch(setSearchQuery(searchQuery));

      // Update total count for search results
      const countQuery = query(
        gamesRef,
        where("name", ">=", searchQuery),
        where("name", "<=", searchQuery + "\uf8ff")
      );

      const countSnapshot = await getCountFromServer(countQuery);
      const total = countSnapshot.data().count;

      // Calculate total pages
      const totalPages = Math.ceil(total / pageLimit);
      dispatch(setTotalPages(totalPages));

      // Return both the data and the total for easier state updates
      return {
        items: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
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

// Fetch the total count using the more efficient getCountFromServer
export const fetchTotalConsolesCount = createAsyncThunk(
  "Consoles/fetchTotalCount",
  async (_, { getState }) => {
    try {
      const { initialFetchDone } = getState().games;
      // Use cached value if available
      if (initialFetchDone) return getState().games.totalGames;

      const coll = collection(db, "console");
      const snapshot = await getCountFromServer(coll);
      return snapshot.data().count;
    } catch (error) {
      console.error("Error fetching console count:", error);
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

// Add a new console
export const addConsole = createAsyncThunk(
  "Consoles/add",
  async (console, { dispatch, getState }) => {
    try {
      // Use the name as the document ID
      const docId = console.name;

      // Create data object with id equal to document ID
      const consoleData = {
        id: docId,
        name: console.name,
        image: console.image,
      };

      // Use setDoc to create document with specific ID in main console collection
      await setDoc(doc(db, "console", docId), consoleData);

      // Also add to new_console collection with only name field
      await addDoc(collection(db, "new_consoles"), { name: console.name });

      // Clear cache to ensure fresh data
      Object.keys(pageCache).forEach((key) => delete pageCache[key]);

      // Update total count
      dispatch(fetchTotalConsolesCount());

      // Refresh the current page
      const { currentPage, gamesPerPage, filterApplied, searchQuery } =
        getState().games;
      if (filterApplied) {
        dispatch(
          searchConsoles({
            query: searchQuery,
            page: currentPage,
            limit: gamesPerPage,
          })
        );
      } else {
        dispatch(fetchConsoles({ page: currentPage, limit: gamesPerPage }));
      }

      return consoleData;
    } catch (error) {
      console.error("Error adding console:", error);
      throw error;
    }
  }
);

// Delete a console
export const deleteConsole = createAsyncThunk(
  "Consoles/delete",
  async (id, { dispatch, getState }) => {
    try {
      // Get the console data before deletion to get the name
      const consoleSnapshot = await getDoc(doc(db, "console", id));
      const consoleData = consoleSnapshot.data();

      // Delete from main console collection
      await deleteDoc(doc(db, "console", id));

      // Delete from new_console collection (name-based matching)
      if (consoleData && consoleData.name) {
        // Query to find the document in new_console with matching name
        const newConsoleQuery = query(
          collection(db, "new_consoles"),
          where("name", "==", consoleData.name)
        );

        const querySnapshot = await getDocs(newConsoleQuery);

        // Delete all matching documents
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      }

      // Clear cache to ensure fresh data
      Object.keys(pageCache).forEach((key) => delete pageCache[key]);

      // Update total pages after deleting
      dispatch(fetchTotalConsolesCount());

      // Check if we need to go to previous page
      const { currentPage, gamesPerPage, items, filterApplied, searchQuery } =
        getState().games;
      if (items.length === 1 && currentPage > 1) {
        dispatch(setCurrentPage(currentPage - 1));
      }

      // Refresh the current page
      if (filterApplied) {
        dispatch(
          searchConsoles({
            query: searchQuery,
            page: currentPage,
            limit: gamesPerPage,
          })
        );
      } else {
        dispatch(fetchConsoles({ page: currentPage, limit: gamesPerPage }));
      }

      return id;
    } catch (error) {
      console.error("Error deleting console:", error);
      throw error;
    }
  }
);

// Update a console
export const updateConsole = createAsyncThunk(
  "Consoles/update",
  async ({ id, ...consoleData }, { dispatch, getState }) => {
    try {
      // Get original console data for updating new_console collection
      const consoleRef = doc(db, "console", id);
      const consoleSnapshot = await getDoc(consoleRef);
      const originalConsole = consoleSnapshot.data();
      let updatedConsoleData;

      // Check if name is changing
      if (originalConsole && originalConsole.name !== consoleData.name) {
        // Create a new document with the new name as ID
        const newDocId = consoleData.name;
        const newConsoleData = {
          id: newDocId,
          name: consoleData.name,
          image: consoleData.image,
        };

        // Create new document with new ID
        await setDoc(doc(db, "console", newDocId), newConsoleData);

        // Delete old document
        await deleteDoc(consoleRef);

        updatedConsoleData = newConsoleData;
      } else {
        // Just update the existing document (name didn't change)
        const updatedData = {
          id: id, // Keep the existing ID
          name: consoleData.name,
          image: consoleData.image,
        };

        await updateDoc(consoleRef, updatedData);
        updatedConsoleData = { id, ...updatedData };
      }

      // Update in new_console collection - find by original name and update to new name
      if (originalConsole && originalConsole.name) {
        // Find the document in new_console with the original name
        const newConsoleQuery = query(
          collection(db, "new_consoles"),
          where("name", "==", originalConsole.name)
        );

        const querySnapshot = await getDocs(newConsoleQuery);

        // Update all matching documents with the new name
        querySnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, { name: consoleData.name });
        });
      }

      // Clear cache for the affected pages
      Object.keys(pageCache).forEach((key) => delete pageCache[key]);

      // Refresh the current page
      const { currentPage, gamesPerPage, filterApplied, searchQuery } =
        getState().games;
      if (filterApplied) {
        dispatch(
          searchConsoles({
            query: searchQuery,
            page: currentPage,
            limit: gamesPerPage,
          })
        );
      } else {
        dispatch(fetchConsoles({ page: currentPage, limit: gamesPerPage }));
      }

      return updatedConsoleData;
    } catch (error) {
      console.error("Error updating console:", error);
      throw error;
    }
  }
);
const consoleSlice = createSlice({
  name: "Consoles",
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
      .addCase(searchConsoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchConsoles.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchTotalConsolesCount.fulfilled, (state, action) => {
        state.totalGames = action.payload;
        // Only update total pages if we're not in a filtered state
        if (!state.filterApplied) {
          state.totalPages = Math.ceil(action.payload / state.gamesPerPage);
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
        state.totalGames++;
      })
      .addCase(deleteConsole.fulfilled, (state, action) => {
        state.items = state.items.filter((game) => game.id !== action.payload);
        state.totalGames--;
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
} = consoleSlice.actions;

export default consoleSlice.reducer;
