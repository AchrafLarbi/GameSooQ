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

// Fetch user users with optimized pagination
export const fetchUsers = createAsyncThunk(
  "Users/fetch",
  async (args = {}, { dispatch }) => {
    // Default to empty object
    const { page = 1, limit: pageLimit = 5 } = args;
    try {
      const UsersRef = collection(db, "users");
      let q;

      if (page > 1 && pageCache[page - 1]) {
        q = query(
          UsersRef,

          startAfter(pageCache[page - 1]),
          limit(pageLimit)
        );
      } else {
        q = query(UsersRef, limit(pageLimit));
      }

      const snapshot = await getDocs(q);

      if (snapshot.docs.length > 0) {
        pageCache[page] = snapshot.docs[snapshot.docs.length - 1];
      }

      dispatch(setFilterApplied(false));

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        lastTokenUpdate: doc.lastTokenUpdate
          ? doc.lastTokenUpdate.toDate().toISOString() // Convert Firestore Timestamp to a string
          : null,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
);

// Fetch a single user user by its ID
export const fetchUserById = createAsyncThunk(
  "Users/fetchById",
  async (userId) => {
    try {
      // First try looking up by document ID
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }

      // If not found by doc ID, try looking up by user_id field
      const UsersRef = collection(db, "users");
      const q = query(UsersRef, where("user_id", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0];
        return { id: docData.id, ...docData.data() };
      }

      throw new Error(" user not found");
    } catch (error) {
      console.error(`Error fetching  user with ID ${userId}:`, error);
      throw error;
    }
  }
);

// Fetch multiple user users by their IDs
export const fetchUsersByIds = createAsyncThunk(
  "Users/fetchByIds",
  async (userIds) => {
    try {
      if (!Array.isArray(userIds) || userIds.length === 0) {
        return [];
      }

      // For small batches, we can do individual lookups
      if (userIds.length <= 10) {
        const results = await Promise.all(
          userIds.map(async (id) => {
            try {
              // First try direct document lookup
              const docRef = doc(db, "users", id);
              const docSnap = await getDoc(docRef);

              if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
              }

              // If not found, try by user_id field
              const q = query(
                collection(db, "users"),
                where("user_id", "==", id)
              );
              const querySnapshot = await getDocs(q);

              if (!querySnapshot.empty) {
                const docData = querySnapshot.docs[0];
                return { id: docData.id, ...docData.data() };
              }

              return null; // Not found
            } catch (error) {
              console.error(`Error fetching  user with ID ${id}:`, error);
              return null;
            }
          })
        );

        return results.filter(Boolean); // Remove null entries (users not found)
      }

      // For larger batches, use queries in chunks
      // Firestore "in" queries are limited to 10 items
      const chunkedResults = [];

      // First try with document IDs
      for (let i = 0; i < userIds.length; i += 10) {
        const chunk = userIds.slice(i, i + 10);
        const UsersRef = collection(db, "users");
        const q = query(UsersRef, where("__name__", "in", chunk));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          chunkedResults.push({ id: doc.id, ...doc.data() });
        });
      }

      // Then try with user_id field for any that weren't found
      const foundIds = new Set(chunkedResults.map((user) => user.id));
      const missingIds = userIds.filter((id) => !foundIds.has(id));

      if (missingIds.length > 0) {
        for (let i = 0; i < missingIds.length; i += 10) {
          const chunk = missingIds.slice(i, i + 10);
          const UsersRef = collection(db, "users");
          const q = query(UsersRef, where("user_id", "in", chunk));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            chunkedResults.push({ id: doc.id, ...doc.data() });
          });
        }
      }

      return chunkedResults;
    } catch (error) {
      console.error("Error fetching users by IDs:", error);
      throw error;
    }
  }
);

// Optimized search functionality by name
export const searchUsers = createAsyncThunk(
  "Users/search",
  async (
    { query: searchQuery, page = 1, limit: pageLimit = 10 },
    { dispatch }
  ) => {
    try {
      if (!searchQuery || searchQuery.trim() === "") {
        // Clear search cache when returning to regular fetch
        clearSearchCache();
        return dispatch(fetchUsers({ page, limit: pageLimit })).unwrap();
      }

      const UsersRef = collection(db, "users");
      const normalizedQuery = searchQuery.toLowerCase();
      let q;

      // First page or no cache
      if (page === 1 || !pageCache[`search_${normalizedQuery}_${page - 1}`]) {
        q = query(
          UsersRef,
          where("name", ">=", searchQuery),
          where("name", "<=", searchQuery + "\uf8ff"),
          orderBy("name"),
          limit(pageLimit)
        );
      } else {
        // For subsequent pages, use the startAfter with the cached document
        const lastDoc = pageCache[`search_${normalizedQuery}_${page - 1}`];
        q = query(
          UsersRef,
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
        UsersRef,
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
      console.error("Error searching users:", error);
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
export const fetchTotalUsersCount = createAsyncThunk(
  "Users/fetchTotalCount",
  async (_, { getState }) => {
    try {
      const { initialFetchDone } = getState().users;
      // Use cached value if available
      if (initialFetchDone) return getState().users.totalUsers;

      const coll = collection(db, "users");
      const snapshot = await getCountFromServer(coll);
      return snapshot.data().count;
    } catch (error) {
      console.error("Error fetching user users count:", error);
      throw error;
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading, initialFetchDone } = getState().users;
      return !loading || !initialFetchDone;
    },
  }
);

export const deleteUser = createAsyncThunk(
  "Users/delete",
  async (id, { dispatch, getState }) => {
    try {
      // Get the user data before deletion to get the name

      // Delete from main users collection
      await deleteDoc(doc(db, "users", id));

      // Clear cache to ensure fresh data
      Object.keys(pageCache).forEach((key) => delete pageCache[key]);

      // Update total pages after deleting
      dispatch(fetchTotalUsersCount());

      // Check if we need to go to previous page
      const { currentPage, usersPerPage, items, filterApplied, searchQuery } =
        getState().users;
      if (items.length === 1 && currentPage > 1) {
        dispatch(setCurrentPage(currentPage - 1));
      }

      // Refresh the current page
      if (filterApplied) {
        dispatch(
          searchUsers({
            query: searchQuery,
            page: currentPage,
            limit: usersPerPage,
          })
        );
      } else {
        dispatch(fetchUsers({ page: currentPage, limit: usersPerPage }));
      }
      return id;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
);

const UsersSlice = createSlice({
  name: "Users",
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    UsersPerPage: 5,
    totalUsers: 0,
    searchResultsCount: 0,
    initialFetchDone: false,
    searchQuery: "",
    filterApplied: false,
    activeFilter: null,
    currentuser: null,
    selectedusers: [],
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
          : state.totalUsers;
        state.totalPages = Math.ceil(count / state.UsersPerPage);
      }
    },
    resetState: (state) => {
      state.loading = false;
      state.error = null;
    },
    clearCurrentuser: (state) => {
      state.currentuser = null;
    },
    clearSelectedusers: (state) => {
      state.selectedusers = [];
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
      state.totalPages = Math.ceil(action.payload / state.UsersPerPage);
    },
    clearPaginationCache: () => {
      // Clear the cache outside of state when needed
      Object.keys(pageCache).forEach((key) => delete pageCache[key]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.filterApplied = false;
        state.initialFetchDone = true;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.currentuser = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
        state.currentuser = null;
      })
      .addCase(fetchUsersByIds.fulfilled, (state, action) => {
        state.selectedusers = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUsersByIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersByIds.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter((user) => user._id !== action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        if (action.payload) {
          // If the payload has the expected structure
          if (action.payload.items) {
            state.items = action.payload.items;
            state.searchResultsCount = action.payload.total || 0;

            // If total is provided, update totalPages
            if (action.payload.total !== undefined) {
              state.totalPages = Math.ceil(
                action.payload.total / state.UsersPerPage
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
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchTotalUsersCount.fulfilled, (state, action) => {
        state.totalUsers = action.payload;
        // Only update total pages if we're not in a filtered state
        if (!state.filterApplied) {
          state.totalPages = Math.ceil(action.payload / state.UsersPerPage);
        }
        state.initialFetchDone = true;
        state.loading = false;
      })
      .addCase(fetchTotalUsersCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalUsersCount.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const {
  setCurrentPage,
  setTotalPages,
  resetState,
  clearCurrentuser,
  clearSelectedusers,
  setSearchQuery,
  setFilterApplied,
  setActiveFilter,
  setSearchResultsCount,
  clearPaginationCache,
} = UsersSlice.actions;

export default UsersSlice.reducer;
