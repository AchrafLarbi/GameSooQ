import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../services/firebase";
import {
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  query,
  limit,
  startAfter,
  orderBy,
  where,
  getCountFromServer,
} from "firebase/firestore";

// Store the last document for each page to enable efficient pagination
const pageCache = {};

// Fetch consolepost ConsolePost with optimized pagination
export const fetchConsolePost = createAsyncThunk(
  "ConsolePost/fetch",
  async (args = {}, { dispatch }) => {
    // Default to empty object
    const { page = 1, limit: pageLimit = 5 } = args;
    try {
      const ConsolePostRef = collection(db, "console_posts");
      let q;

      if (page > 1 && pageCache[page - 1]) {
        q = query(
          ConsolePostRef,

          startAfter(pageCache[page - 1]),
          limit(pageLimit)
        );
      } else {
        q = query(ConsolePostRef, limit(pageLimit));
      }

      const snapshot = await getDocs(q);

      if (snapshot.docs.length > 0) {
        pageCache[page] = snapshot.docs[snapshot.docs.length - 1];
      }

      dispatch(setFilterApplied(false));

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at
          ? doc.data().created_at.toDate().toISOString()
          : null,
      }));
    } catch (error) {
      console.error("Error fetching ConsolePost:", error);
      throw error;
    }
  }
);

// Fetch a single consolepost consolepost by its ID
export const fetchconsolepostById = createAsyncThunk(
  "ConsolePost/fetchById",
  async (consolepostId) => {
    try {
      // First try looking up by document ID
      const docRef = doc(db, "console_posts", consolepostId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }

      // If not found by doc ID, try looking up by consolepost_id field
      const ConsolePostRef = collection(db, "console_posts");
      const q = query(ConsolePostRef, where("post_id", "==", consolepostId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0];
        return { id: docData.id, ...docData.data() };
      }

      throw new Error(" consolepost not found");
    } catch (error) {
      console.error(
        `Error fetching  consolepost with ID ${consolepostId}:`,
        error
      );
      throw error;
    }
  }
);

// Fetch multiple consolepost ConsolePost by their IDs
export const fetchConsolePostByIds = createAsyncThunk(
  "ConsolePost/fetchByIds",
  async (consolepostIds) => {
    try {
      if (!Array.isArray(consolepostIds) || consolepostIds.length === 0) {
        return [];
      }

      // For small batches, we can do individual lookups
      if (consolepostIds.length <= 10) {
        const results = await Promise.all(
          consolepostIds.map(async (id) => {
            try {
              // First try direct document lookup
              const docRef = doc(db, "console_posts", id);
              const docSnap = await getDoc(docRef);

              if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
              }

              // If not found, try by consolepost_id field
              const q = query(
                collection(db, "console_posts"),
                where("post_id ", "==", id)
              );
              const querySnapshot = await getDocs(q);

              if (!querySnapshot.empty) {
                const docData = querySnapshot.docs[0];
                return { id: docData.id, ...docData.data() };
              }

              return null; // Not found
            } catch (error) {
              console.error(
                `Error fetching  consolepost with ID ${id}:`,
                error
              );
              return null;
            }
          })
        );

        return results.filter(Boolean); // Remove null entries (ConsolePost not found)
      }

      // For larger batches, use queries in chunks
      // Firestore "in" queries are limited to 10 items
      const chunkedResults = [];

      // First try with document IDs
      for (let i = 0; i < consolepostIds.length; i += 10) {
        const chunk = consolepostIds.slice(i, i + 10);
        const ConsolePostRef = collection(db, "console_posts");
        const q = query(ConsolePostRef, where("__name__", "in", chunk));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          chunkedResults.push({ id: doc.id, ...doc.data() });
        });
      }

      // Then try with consolepost_id field for any that weren't found
      const foundIds = new Set(
        chunkedResults.map((consolepost) => consolepost.id)
      );
      const missingIds = consolepostIds.filter((id) => !foundIds.has(id));

      if (missingIds.length > 0) {
        for (let i = 0; i < missingIds.length; i += 10) {
          const chunk = missingIds.slice(i, i + 10);
          const ConsolePostRef = collection(db, "console_posts");
          const q = query(ConsolePostRef, where("post_id ", "in", chunk));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            chunkedResults.push({ id: doc.id, ...doc.data() });
          });
        }
      }

      return chunkedResults;
    } catch (error) {
      console.error("Error fetching ConsolePost by IDs:", error);
      throw error;
    }
  }
);

// Optimized search functionality by name
export const searchConsolePost = createAsyncThunk(
  "ConsolePost/search",
  async (
    { query: searchQuery, page = 1, limit: pageLimit = 10 },
    { dispatch }
  ) => {
    try {
      if (!searchQuery || searchQuery.trim() === "") {
        // Clear search cache when returning to regular fetch
        clearSearchCache();
        return dispatch(fetchConsolePost({ page, limit: pageLimit })).unwrap();
      }

      const ConsolePostRef = collection(db, "console_posts");
      const normalizedQuery = searchQuery.toLowerCase();
      let q;

      // First page or no cache
      if (page === 1 || !pageCache[`search_${normalizedQuery}_${page - 1}`]) {
        q = query(
          ConsolePostRef,
          where("consolename", ">=", searchQuery),
          where("consolename", "<=", searchQuery + "\uf8ff"),
          orderBy("consolename"),
          limit(pageLimit)
        );
      } else {
        // For subsequent pages, use the startAfter with the cached document
        const lastDoc = pageCache[`search_${normalizedQuery}_${page - 1}`];
        q = query(
          ConsolePostRef,
          where("consolename", ">=", searchQuery),
          where("consolename", "<=", searchQuery + "\uf8ff"),
          orderBy("consolename"),
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
        ConsolePostRef,
        where("consolename", ">=", searchQuery),
        where("consolename", "<=", searchQuery + "\uf8ff")
      );

      const countSnapshot = await getCountFromServer(countQuery);
      const total = countSnapshot.data().count;

      // Calculate total pages
      const totalPages = Math.ceil(total / pageLimit);
      dispatch(setTotalPages(totalPages));

      // Return both the data and the total for easier state updates
      return {
        items: snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            created_at: data.created_at
              ? data.created_at.toDate().toISOString()
              : null, // Convert Firestore Timestamp
          };
        }),
        total,
      };
    } catch (error) {
      console.error("Error searching ConsolePost:", error);
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
export const fetchTotalConsolePostCount = createAsyncThunk(
  "ConsolePost/fetchTotalCount",
  async (_, { getState }) => {
    try {
      const { initialFetchDone } = getState().consolePosts;
      // Use cached value if available
      if (initialFetchDone) return getState().consolePosts.totalConsolePost;

      const coll = collection(db, "console_posts");
      const snapshot = await getCountFromServer(coll);
      return snapshot.data().count;
    } catch (error) {
      console.error("Error fetching consolepost ConsolePost count:", error);
      throw error;
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading, initialFetchDone } = getState().consolePosts;
      return !loading || !initialFetchDone;
    },
  }
);

export const deleteconsolepost = createAsyncThunk(
  "ConsolePost/delete",
  async (id, { dispatch, getState }) => {
    try {
      // Get the consolepost data before deletion to get the name

      // Delete from main ConsolePost collection
      await deleteDoc(doc(db, "console_posts", id));

      // Clear cache to ensure fresh data
      Object.keys(pageCache).forEach((key) => delete pageCache[key]);

      // Update total pages after deleting
      dispatch(fetchTotalConsolePostCount());

      // Check if we need to go to previous page
      const {
        currentPage,
        ConsolePostPerPage,
        items,
        filterApplied,
        searchQuery,
      } = getState().consolePosts;
      if (items.length === 1 && currentPage > 1) {
        dispatch(setCurrentPage(currentPage - 1));
      }

      // Refresh the current page
      if (filterApplied) {
        dispatch(
          searchConsolePost({
            query: searchQuery,
            page: currentPage,
            limit: ConsolePostPerPage,
          })
        );
      } else {
        dispatch(
          fetchConsolePost({ page: currentPage, limit: ConsolePostPerPage })
        );
      }
      return id;
    } catch (error) {
      console.error("Error deleting consolepost:", error);
      throw error;
    }
  }
);

const ConsolePostSlice = createSlice({
  name: "ConsolePost",
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    ConsolePostPerPage: 5,
    totalConsolePost: 0,
    searchResultsCount: 0,
    initialFetchDone: false,
    searchQuery: "",
    filterApplied: false,
    activeFilter: null,
    currentconsolepost: null,
    selectedConsolePost: [],
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action) => {
      if (action.payload) {
        state.totalPages = action.payload;
      } else {
        const count = state.filterApplied
          ? state.searchResultsCount
          : state.totalConsolePost;
        state.totalPages = Math.ceil(count / state.ConsolePostPerPage);
      }
    },
    resetState: (state) => {
      state.loading = false;
      state.error = null;
    },
    clearCurrentconsolepost: (state) => {
      state.currentconsolepost = null;
    },
    clearSelectedConsolePost: (state) => {
      state.selectedConsolePost = [];
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilterApplied: (state, action) => {
      state.filterApplied = action.payload;
      if (!action.payload) {
        state.activeFilter = null;
      }
    },
    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
    setSearchResultsCount: (state, action) => {
      state.searchResultsCount = action.payload;
      // Update total pages based on search results
      state.totalPages = Math.ceil(action.payload / state.ConsolePostPerPage);
    },
    clearPaginationCache: () => {
      // Clear the cache outside of state when needed
      Object.keys(pageCache).forEach((key) => delete pageCache[key]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConsolePost.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.filterApplied = false;
        state.initialFetchDone = true;
      })
      .addCase(fetchConsolePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsolePost.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchconsolepostById.fulfilled, (state, action) => {
        state.currentconsolepost = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchconsolepostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchconsolepostById.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
        state.currentconsolepost = null;
      })
      .addCase(fetchConsolePostByIds.fulfilled, (state, action) => {
        state.selectedConsolePost = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchConsolePostByIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsolePostByIds.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(deleteconsolepost.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (consolepost) => consolepost._id !== action.payload
        );
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteconsolepost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteconsolepost.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(searchConsolePost.fulfilled, (state, action) => {
        if (action.payload) {
          // If the payload has the expected structure
          if (action.payload.items) {
            state.items = action.payload.items;
            state.searchResultsCount = action.payload.total || 0;

            // If total is provided, update totalPages
            if (action.payload.total !== undefined) {
              state.totalPages = Math.ceil(
                action.payload.total / state.ConsolePostPerPage
              );
            }
          } else {
            // Fallback for backward compatibility
            state.items = action.payload;
          }
        }
        state.loading = false;
        state.initialFetchDone = true;
        state.activeFilter = "search";
      })
      .addCase(searchConsolePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchConsolePost.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchTotalConsolePostCount.fulfilled, (state, action) => {
        state.totalConsolePost = action.payload;
        // Only update total pages if we're not in a filtered state
        if (!state.filterApplied) {
          state.totalPages = Math.ceil(
            action.payload / state.ConsolePostPerPage
          );
        }
        state.initialFetchDone = true;
        state.loading = false;
      })
      .addCase(fetchTotalConsolePostCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalConsolePostCount.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const {
  setCurrentPage,
  setTotalPages,
  resetState,
  clearCurrentconsolepost,
  clearSelectedConsolePost,
  setSearchQuery,
  setFilterApplied,
  setActiveFilter,
  setSearchResultsCount,
  clearPaginationCache,
} = ConsolePostSlice.actions;

export default ConsolePostSlice.reducer;
