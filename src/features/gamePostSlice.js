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

// Fetch game posts with optimized pagination
export const fetchGamePosts = createAsyncThunk(
  "GamePosts/fetch",
  async (args = {}, { dispatch }) => {
    // Default to empty object
    const { page = 1, limit: pageLimit = 5 } = args;
    try {
      const gamePostsRef = collection(db, "game_posts");
      let q;

      if (page > 1 && pageCache[page - 1]) {
        q = query(
          gamePostsRef,
          orderBy("created_At", "desc"),
          startAfter(pageCache[page - 1]),
          limit(pageLimit)
        );
      } else {
        q = query(
          gamePostsRef,
          orderBy("created_At", "desc"),
          limit(pageLimit)
        );
      }

      const snapshot = await getDocs(q);

      if (snapshot.docs.length > 0) {
        pageCache[page] = snapshot.docs[snapshot.docs.length - 1];
      }

      dispatch(setFilterApplied(false));

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        created_At: doc.data().created_At
          ? doc.data().created_At.toDate().toISOString()
          : null,
      }));
    } catch (error) {
      console.error("Error fetching game posts:", error);
      throw error;
    }
  }
);

// Fetch a single game post by its ID
export const fetchGamePostById = createAsyncThunk(
  "GamePosts/fetchById",
  async (postId) => {
    try {
      // First try looking up by document ID
      const docRef = doc(db, "game_posts", postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }

      // If not found by doc ID, try looking up by post_id field
      const gamePostsRef = collection(db, "game_posts");
      const q = query(gamePostsRef, where("post_id", "==", postId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0];
        return { id: docData.id, ...docData.data() };
      }

      throw new Error("Game post not found");
    } catch (error) {
      console.error(`Error fetching game post with ID ${postId}:`, error);
      throw error;
    }
  }
);

// Fetch multiple game posts by their IDs
export const fetchGamePostsByIds = createAsyncThunk(
  "GamePosts/fetchByIds",
  async (postIds) => {
    try {
      if (!Array.isArray(postIds) || postIds.length === 0) {
        return [];
      }

      // For small batches, we can do individual lookups
      if (postIds.length <= 10) {
        const results = await Promise.all(
          postIds.map(async (id) => {
            try {
              // First try direct document lookup
              const docRef = doc(db, "game_posts", id);
              const docSnap = await getDoc(docRef);

              if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
              }

              // If not found, try by post_id field
              const q = query(
                collection(db, "game_posts"),
                where("post_id", "==", id)
              );
              const querySnapshot = await getDocs(q);

              if (!querySnapshot.empty) {
                const docData = querySnapshot.docs[0];
                return { id: docData.id, ...docData.data() };
              }

              return null; // Not found
            } catch (error) {
              console.error(`Error fetching game post with ID ${id}:`, error);
              return null;
            }
          })
        );

        return results.filter(Boolean); // Remove null entries (posts not found)
      }

      // For larger batches, use queries in chunks
      // Firestore "in" queries are limited to 10 items
      const chunkedResults = [];

      // First try with document IDs
      for (let i = 0; i < postIds.length; i += 10) {
        const chunk = postIds.slice(i, i + 10);
        const gamePostsRef = collection(db, "game_posts");
        const q = query(gamePostsRef, where("__name__", "in", chunk));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          chunkedResults.push({ id: doc.id, ...doc.data() });
        });
      }

      // Then try with post_id field for any that weren't found
      const foundIds = new Set(chunkedResults.map((post) => post.id));
      const missingIds = postIds.filter((id) => !foundIds.has(id));

      if (missingIds.length > 0) {
        for (let i = 0; i < missingIds.length; i += 10) {
          const chunk = missingIds.slice(i, i + 10);
          const gamePostsRef = collection(db, "game_posts");
          const q = query(gamePostsRef, where("post_id", "in", chunk));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            chunkedResults.push({ id: doc.id, ...doc.data() });
          });
        }
      }

      return chunkedResults;
    } catch (error) {
      console.error("Error fetching game posts by IDs:", error);
      throw error;
    }
  }
);

// Optimized search functionality by gamename
export const searchGamePosts = createAsyncThunk(
  "GamePosts/search",
  async (
    { query: searchQuery, page = 1, limit: pageLimit = 10 },
    { dispatch }
  ) => {
    try {
      if (!searchQuery || searchQuery.trim() === "") {
        // Clear search cache when returning to regular fetch
        clearSearchCache();
        return dispatch(fetchGamePosts({ page, limit: pageLimit })).unwrap();
      }

      const gamePostsRef = collection(db, "game_posts");
      const normalizedQuery = searchQuery.toLowerCase();
      let q;

      // First page or no cache
      if (page === 1 || !pageCache[`search_${normalizedQuery}_${page - 1}`]) {
        q = query(
          gamePostsRef,
          where("gamename", ">=", searchQuery),
          where("gamename", "<=", searchQuery + "\uf8ff"),
          orderBy("gamename"),
          orderBy("created_At", "desc"),
          limit(pageLimit)
        );
      } else {
        // For subsequent pages, use the startAfter with the cached document
        const lastDoc = pageCache[`search_${normalizedQuery}_${page - 1}`];
        q = query(
          gamePostsRef,
          where("gamename", ">=", searchQuery),
          where("gamename", "<=", searchQuery + "\uf8ff"),
          orderBy("gamename"),
          orderBy("created_At", "desc"),
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
        gamePostsRef,
        where("gamename", ">=", searchQuery),
        where("gamename", "<=", searchQuery + "\uf8ff")
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
            created_At: data.created_At
              ? data.created_At.toDate().toISOString()
              : null, // Convert Firestore Timestamp
          };
        }),
        total,
      };
    } catch (error) {
      console.error("Error searching game posts:", error);
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

// Fetch game posts by platform
export const fetchGamePostsByPlatform = createAsyncThunk(
  "GamePosts/fetchByPlatform",
  async ({ platform, page = 1, limit: pageLimit = 10 }, { dispatch }) => {
    try {
      const gamePostsRef = collection(db, "game_posts");
      let q;

      // First page or no cache
      if (page === 1 || !pageCache[`platform_${platform}_${page - 1}`]) {
        q = query(
          gamePostsRef,
          where("platform", "array-contains", platform),
          orderBy("created_At", "desc"),
          limit(pageLimit)
        );
      } else {
        // For subsequent pages, use the startAfter with the cached document
        const lastDoc = pageCache[`platform_${platform}_${page - 1}`];
        q = query(
          gamePostsRef,
          where("platform", "array-contains", platform),
          orderBy("created_At", "desc"),
          startAfter(lastDoc),
          limit(pageLimit)
        );
      }

      const snapshot = await getDocs(q);

      // Cache the last document for pagination
      if (snapshot.docs.length > 0) {
        pageCache[`platform_${platform}_${page}`] =
          snapshot.docs[snapshot.docs.length - 1];
      }

      // Set flags in state
      dispatch(setFilterApplied(true));

      // Update total count for platform results
      const countQuery = query(
        gamePostsRef,
        where("platform", "array-contains", platform)
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
            created_At: data.created_At
              ? data.created_At.toDate().toISOString()
              : null, // Convert Firestore Timestamp
          };
        }),
        total,
      };
    } catch (error) {
      console.error("Error fetching game posts by platform:", error);
      throw error;
    }
  }
);

// Fetch game posts by user ID
export const fetchGamePostsByUserId = createAsyncThunk(
  "GamePosts/fetchByUserId",
  async ({ userId, page = 1, limit: pageLimit = 10 }, { dispatch }) => {
    try {
      const gamePostsRef = collection(db, "game_posts");
      let q;

      // First page or no cache
      if (page === 1 || !pageCache[`user_${userId}_${page - 1}`]) {
        q = query(
          gamePostsRef,
          where("user_id", "==", userId),
          orderBy("created_At", "desc"),
          limit(pageLimit)
        );
      } else {
        // For subsequent pages, use the startAfter with the cached document
        const lastDoc = pageCache[`user_${userId}_${page - 1}`];
        q = query(
          gamePostsRef,
          where("user_id", "==", userId),
          orderBy("created_At", "desc"),
          startAfter(lastDoc),
          limit(pageLimit)
        );
      }

      const snapshot = await getDocs(q);

      // Cache the last document for pagination
      if (snapshot.docs.length > 0) {
        pageCache[`user_${userId}_${page}`] =
          snapshot.docs[snapshot.docs.length - 1];
      }

      // Set flags in state
      dispatch(setFilterApplied(true));

      // Update total count for user posts
      const countQuery = query(gamePostsRef, where("user_id", "==", userId));

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
            created_At: data.created_At
              ? data.created_At.toDate().toISOString()
              : null, // Convert Firestore Timestamp
          };
        }),
        total,
      };
    } catch (error) {
      console.error("Error fetching game posts by user ID:", error);
      throw error;
    }
  }
);

// Fetch the total count using the more efficient getCountFromServer
export const fetchTotalGamePostsCount = createAsyncThunk(
  "GamePosts/fetchTotalCount",
  async (_, { getState }) => {
    try {
      const { initialFetchDone } = getState().gamePosts;
      // Use cached value if available
      if (initialFetchDone) return getState().gamePosts.totalGamePosts;

      const coll = collection(db, "game_posts");
      const snapshot = await getCountFromServer(coll);
      return snapshot.data().count;
    } catch (error) {
      console.error("Error fetching game posts count:", error);
      throw error;
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading, initialFetchDone } = getState().gamePosts;
      return !loading || !initialFetchDone;
    },
  }
);

export const deleteGamePost = createAsyncThunk(
  "GamePosts/delete",
  async (id, { dispatch, getState }) => {
    try {
      // Get the game data before deletion to get the name

      // Delete from main Games collection
      await deleteDoc(doc(db, "game_posts", id));

      // Clear cache to ensure fresh data
      Object.keys(pageCache).forEach((key) => delete pageCache[key]);

      // Update total pages after deleting
      dispatch(fetchTotalGamePostsCount());

      // Check if we need to go to previous page
      const { currentPage, gamesPerPage, items, filterApplied, searchQuery } =
        getState().games;
      if (items.length === 1 && currentPage > 1) {
        dispatch(setCurrentPage(currentPage - 1));
      }

      // Refresh the current page
      if (filterApplied) {
        dispatch(
          searchGamePosts({
            query: searchQuery,
            page: currentPage,
            limit: gamesPerPage,
          })
        );
      } else {
        dispatch(fetchGamePosts({ page: currentPage, limit: gamesPerPage }));
      }
      return id;
    } catch (error) {
      console.error("Error deleting game:", error);
      throw error;
    }
  }
);

const gamePostsSlice = createSlice({
  name: "GamePosts",
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    gamePostsPerPage: 5,
    totalGamePosts: 0,
    searchResultsCount: 0,
    initialFetchDone: false,
    searchQuery: "",
    filterApplied: false,
    activeFilter: null,
    currentPost: null,
    selectedPosts: [],
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
          : state.totalGamePosts;
        state.totalPages = Math.ceil(count / state.gamePostsPerPage);
      }
    },
    resetState: (state) => {
      state.loading = false;
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    clearSelectedPosts: (state) => {
      state.selectedPosts = [];
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
      state.totalPages = Math.ceil(action.payload / state.gamePostsPerPage);
    },
    clearPaginationCache: () => {
      // Clear the cache outside of state when needed
      Object.keys(pageCache).forEach((key) => delete pageCache[key]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGamePosts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.filterApplied = false;
        state.initialFetchDone = true;
      })
      .addCase(fetchGamePosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGamePosts.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchGamePostById.fulfilled, (state, action) => {
        state.currentPost = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchGamePostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGamePostById.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
        state.currentPost = null;
      })
      .addCase(fetchGamePostsByIds.fulfilled, (state, action) => {
        state.selectedPosts = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchGamePostsByIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGamePostsByIds.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(deleteGamePost.fulfilled, (state, action) => {
        state.items = state.items.filter((post) => post._id !== action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteGamePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGamePost.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(searchGamePosts.fulfilled, (state, action) => {
        if (action.payload) {
          // If the payload has the expected structure
          if (action.payload.items) {
            state.items = action.payload.items;
            state.searchResultsCount = action.payload.total || 0;

            // If total is provided, update totalPages
            if (action.payload.total !== undefined) {
              state.totalPages = Math.ceil(
                action.payload.total / state.gamePostsPerPage
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
      .addCase(searchGamePosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchGamePosts.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchGamePostsByPlatform.fulfilled, (state, action) => {
        if (action.payload) {
          if (action.payload.items) {
            state.items = action.payload.items;
            state.searchResultsCount = action.payload.total || 0;

            if (action.payload.total !== undefined) {
              state.totalPages = Math.ceil(
                action.payload.total / state.gamePostsPerPage
              );
            }
          } else {
            state.items = action.payload;
          }
        }
        state.loading = false;
        state.initialFetchDone = true;
        state.activeFilter = "platform";
      })
      .addCase(fetchGamePostsByPlatform.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGamePostsByPlatform.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchGamePostsByUserId.fulfilled, (state, action) => {
        if (action.payload) {
          if (action.payload.items) {
            state.items = action.payload.items;
            state.searchResultsCount = action.payload.total || 0;

            if (action.payload.total !== undefined) {
              state.totalPages = Math.ceil(
                action.payload.total / state.gamePostsPerPage
              );
            }
          } else {
            state.items = action.payload;
          }
        }
        state.loading = false;
        state.initialFetchDone = true;
        state.activeFilter = "user";
      })
      .addCase(fetchGamePostsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGamePostsByUserId.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchTotalGamePostsCount.fulfilled, (state, action) => {
        state.totalGamePosts = action.payload;
        // Only update total pages if we're not in a filtered state
        if (!state.filterApplied) {
          state.totalPages = Math.ceil(action.payload / state.gamePostsPerPage);
        }
        state.initialFetchDone = true;
        state.loading = false;
      })
      .addCase(fetchTotalGamePostsCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalGamePostsCount.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const {
  setCurrentPage,
  setTotalPages,
  resetState,
  clearCurrentPost,
  clearSelectedPosts,
  setSearchQuery,
  setFilterApplied,
  setActiveFilter,
  setSearchResultsCount,
  clearPaginationCache,
} = gamePostsSlice.actions;

export default gamePostsSlice.reducer;
