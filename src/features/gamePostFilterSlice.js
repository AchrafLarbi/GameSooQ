import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../services/firebase";
import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  orderBy,
  where,
  getCountFromServer,
} from "firebase/firestore";

// Store the last document for each page to enable efficient pagination
const pageCache = {};

// Fetch all available filter options from Firestore
export const fetchAllFilterOptions = createAsyncThunk(
  "GamePosts/fetchFilterOptions",
  async (_, { dispatch }) => {
    try {
      const gamePostsRef = collection(db, "game_posts");

      // Fetch all documents to extract unique filter values
      const snapshot = await getDocs(gamePostsRef);

      const platforms = new Set();
      const locations = new Set();
      const transactionTypes = new Set();

      // Extract unique filter values from all documents
      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        // Handle platforms (array field)
        if (data.platform && Array.isArray(data.platform)) {
          data.platform.forEach((p) => platforms.add(p));
        }

        // Handle location (string field)
        if (data.location) {
          locations.add(data.location);
        }

        // Handle transaction_type (string field)
        if (data.transaction_type) {
          transactionTypes.add(data.transaction_type);
        }
      });

      // Convert Sets to Arrays
      const filterOptions = {
        platforms: Array.from(platforms),
        locations: Array.from(locations),
        transactionTypes: Array.from(transactionTypes),
      };

      // Update available filters in the state
      dispatch(setAvailableFilters(filterOptions));

      return filterOptions;
    } catch (error) {
      console.error("Error fetching filter options:", error);
      throw error;
    }
  }
);

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

      // Get total count for pagination
      const countSnapshot = await getCountFromServer(
        collection(db, "game_posts")
      );
      const total = countSnapshot.data().count;

      // Calculate total pages
      const totalPages = Math.ceil(total / pageLimit);
      dispatch(setTotalPages(totalPages));
      dispatch(setTotalGamePosts(total));

      // Fetch all filter options if it's the first page
      if (page === 1) {
        dispatch(fetchAllFilterOptions());
      }

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
      dispatch(setActiveFilter("platform"));

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
      dispatch(setSearchResultsCount(total));

      // Ensure we have all filter options
      if (page === 1) {
        dispatch(fetchAllFilterOptions());
      }

      // Return both the data and the total for easier state updates
      return {
        items: snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            created_At: data.created_At
              ? data.created_At.toDate().toISOString()
              : null,
          };
        }),
        total,
        filterType: "platform",
        filterValue: platform,
      };
    } catch (error) {
      console.error("Error fetching game posts by platform:", error);
      throw error;
    }
  }
);

// Fetch game posts by location
export const fetchGamePostsByLocation = createAsyncThunk(
  "GamePosts/fetchByLocation",
  async ({ location, page = 1, limit: pageLimit = 10 }, { dispatch }) => {
    try {
      console.log("Fetching by location:", location, "page:", page);
      const gamePostsRef = collection(db, "game_posts");
      let q;

      // First page or no cache
      if (page === 1 || !pageCache[`location_${location}_${page - 1}`]) {
        console.log("Building first page query for location");
        q = query(
          gamePostsRef,
          where("location", "==", location),
          orderBy("created_At", "desc"),
          limit(pageLimit)
        );
      } else {
        // For subsequent pages, use the startAfter with the cached document
        console.log("Building paginated query for location");
        const lastDoc = pageCache[`location_${location}_${page - 1}`];
        q = query(
          gamePostsRef,
          where("location", "==", location),
          orderBy("created_At", "desc"),
          startAfter(lastDoc),
          limit(pageLimit)
        );
      }

      console.log("Executing location query");
      const snapshot = await getDocs(q);
      console.log("Location query results:", snapshot.docs.length);

      // Cache the last document for pagination
      if (snapshot.docs.length > 0) {
        pageCache[`location_${location}_${page}`] =
          snapshot.docs[snapshot.docs.length - 1];
      }

      // Set flags in state
      dispatch(setFilterApplied(true));
      dispatch(setActiveFilter("location"));

      // Update total count for location results
      const countQuery = query(gamePostsRef, where("location", "==", location));
      console.log("Fetching count for location filter");
      const countSnapshot = await getCountFromServer(countQuery);
      const total = countSnapshot.data().count;
      console.log("Total items for location filter:", total);

      // Calculate total pages
      const totalPages = Math.ceil(total / pageLimit);
      dispatch(setTotalPages(totalPages));
      dispatch(setSearchResultsCount(total));

      // Ensure we have all filter options
      if (page === 1) {
        dispatch(fetchAllFilterOptions());
      }

      // Return both the data and the total
      return {
        items: snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            created_At: data.created_At
              ? data.created_At.toDate().toISOString()
              : null,
          };
        }),
        total,
        filterType: "location",
        filterValue: location,
      };
    } catch (error) {
      console.error("Error fetching game posts by location:", error);
      throw error;
    }
  }
);

// Fetch game posts by transaction type
export const fetchGamePostsByTransactionType = createAsyncThunk(
  "GamePosts/fetchByTransactionType",
  async (
    { transactionType, page = 1, limit: pageLimit = 10 },
    { dispatch }
  ) => {
    try {
      console.log(
        "Fetching by transaction type:",
        transactionType,
        "page:",
        page
      );
      const gamePostsRef = collection(db, "game_posts");
      let q;

      // First page or no cache
      if (
        page === 1 ||
        !pageCache[`transaction_${transactionType}_${page - 1}`]
      ) {
        console.log("Building first page query for transaction type");
        q = query(
          gamePostsRef,
          where("transaction_type", "==", transactionType),
          orderBy("created_At", "desc"),
          limit(pageLimit)
        );
      } else {
        // For subsequent pages, use the startAfter with the cached document
        console.log("Building paginated query for transaction type");
        const lastDoc = pageCache[`transaction_${transactionType}_${page - 1}`];
        q = query(
          gamePostsRef,
          where("transaction_type", "==", transactionType),
          orderBy("created_At", "desc"),
          startAfter(lastDoc),
          limit(pageLimit)
        );
      }

      console.log("Executing transaction type query");
      const snapshot = await getDocs(q);
      console.log("Transaction type query results:", snapshot.docs.length);

      // Cache the last document for pagination
      if (snapshot.docs.length > 0) {
        pageCache[`transaction_${transactionType}_${page}`] =
          snapshot.docs[snapshot.docs.length - 1];
      }

      // Set flags in state
      dispatch(setFilterApplied(true));
      dispatch(setActiveFilter("transaction_type"));

      // Update total count for transaction type results
      const countQuery = query(
        gamePostsRef,
        where("transaction_type", "==", transactionType)
      );

      console.log("Fetching count for transaction type filter");
      const countSnapshot = await getCountFromServer(countQuery);
      const total = countSnapshot.data().count;
      console.log("Total items for transaction type filter:", total);

      // Calculate total pages
      const totalPages = Math.ceil(total / pageLimit);
      dispatch(setTotalPages(totalPages));
      dispatch(setSearchResultsCount(total));

      // Ensure we have all filter options
      if (page === 1) {
        dispatch(fetchAllFilterOptions());
      }

      // Return both the data and the total
      return {
        items: snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            created_At: data.created_At
              ? data.created_At.toDate().toISOString()
              : null,
          };
        }),
        total,
        filterType: "transaction_type",
        filterValue: transactionType,
      };
    } catch (error) {
      console.error("Error fetching game posts by transaction type:", error);
      throw error;
    }
  }
);

// Combined multi-filter function
export const fetchGamePostsWithMultipleFilters = createAsyncThunk(
  "GamePosts/fetchWithFilters",
  async ({ filters, page = 1, limit: pageLimit = 10 }, { dispatch }) => {
    try {
      console.log("Fetching with multiple filters:", filters, "page:", page);
      const gamePostsRef = collection(db, "game_posts");

      // Create a unique cache key based on all filter values
      const filterKey = Object.entries(filters)
        // eslint-disable-next-line no-unused-vars
        .filter(([_, value]) => value !== null && value !== undefined)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, value]) => `${key}_${value}`)
        .join("_");

      // Base conditions for the query
      let conditions = [];

      // Add platform filter if present (array-contains)
      if (filters.platform) {
        conditions.push(where("platform", "array-contains", filters.platform));
      }

      // Add location filter if present (equality)
      if (filters.location) {
        conditions.push(where("location", "==", filters.location));
      }

      // Add transaction_type filter if present (equality)
      if (filters.transaction_type) {
        conditions.push(
          where("transaction_type", "==", filters.transaction_type)
        );
      }

      // If no filters, return regular posts
      if (conditions.length === 0) {
        return dispatch(fetchGamePosts({ page, limit: pageLimit })).unwrap();
      }

      let q;

      // For the first page or if no cache exists
      if (page === 1 || !pageCache[`filters_${filterKey}_${page - 1}`]) {
        console.log("Building first page query for multi-filter");
        // Firestore limitations: Can't use multiple range/array queries
        // We need to structure our query carefully
        q = query(
          gamePostsRef,
          ...conditions,
          orderBy("created_At", "desc"),
          limit(pageLimit)
        );
      } else {
        // Use cached document for pagination
        console.log("Building paginated query for multi-filter");
        const lastDoc = pageCache[`filters_${filterKey}_${page - 1}`];
        q = query(
          gamePostsRef,
          ...conditions,
          orderBy("created_At", "desc"),
          startAfter(lastDoc),
          limit(pageLimit)
        );
      }

      console.log("Executing multi-filter query");
      const snapshot = await getDocs(q);
      console.log("Multi-filter query results:", snapshot.docs.length);

      // Cache the last document for pagination
      if (snapshot.docs.length > 0) {
        pageCache[`filters_${filterKey}_${page}`] =
          snapshot.docs[snapshot.docs.length - 1];
      }

      // Set flags in state
      dispatch(setFilterApplied(true));
      dispatch(setActiveFilter("multi"));

      // Update current filters
      dispatch(setCurrentFilter(filters));

      // Get total count for the combined filters
      const countQuery = query(gamePostsRef, ...conditions);

      console.log("Fetching count for multi-filter");
      const countSnapshot = await getCountFromServer(countQuery);
      const total = countSnapshot.data().count;
      console.log("Total items for multi-filter:", total);

      // Calculate total pages
      const totalPages = Math.ceil(total / pageLimit);
      dispatch(setTotalPages(totalPages));
      dispatch(setSearchResultsCount(total));

      // Ensure we have all filter options
      if (page === 1) {
        dispatch(fetchAllFilterOptions());
      }

      // Return both the data and the total
      return {
        items: snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            created_At: data.created_At
              ? data.created_At.toDate().toISOString()
              : null,
          };
        }),
        total,
        filterType: "multi",
        filters,
      };
    } catch (error) {
      console.error("Error fetching game posts with multiple filters:", error);
      throw error;
    }
  }
);

// Clear all filters and reset to default view
export const clearAllFilters = createAsyncThunk(
  "GamePosts/clearFilters",
  async ({ page = 1, limit: pageLimit = 5 }, { dispatch }) => {
    try {
      console.log("Clearing all filters");
      // Reset all filter-related state
      dispatch(setFilterApplied(false));
      dispatch(setActiveFilter(null));
      dispatch(
        setCurrentFilter({
          platform: null,
          location: null,
          transaction_type: null,
        })
      );

      // Clear filter-specific cache entries
      Object.keys(pageCache).forEach((key) => {
        if (
          key.includes("platform_") ||
          key.includes("location_") ||
          key.includes("transaction_") ||
          key.includes("filters_")
        ) {
          delete pageCache[key];
        }
      });

      // Make sure we still have all filter options available
      dispatch(fetchAllFilterOptions());

      // Fetch regular posts
      return dispatch(fetchGamePosts({ page, limit: pageLimit })).unwrap();
    } catch (error) {
      console.error("Error clearing filters:", error);
      throw error;
    }
  }
);

const gamePostsFilterSlice = createSlice({
  name: "gamePostsFilterSlice",
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
    // Filter state
    currentFilter: {
      platform: null,
      location: null,
      transaction_type: null,
    },
    availableFilters: {
      platforms: [], // Will be populated from Firestore directly
      locations: [], // Will be populated from Firestore directly
      transactionTypes: [], // Will be populated from Firestore directly
    },
    filterOptionsLoaded: false, // Track whether filter options have been loaded
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
    setTotalGamePosts: (state, action) => {
      state.totalGamePosts = action.payload;
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
        state.currentFilter = {
          platform: null,
          location: null,
          transaction_type: null,
        };
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
    // Filter management
    setCurrentFilter: (state, action) => {
      state.currentFilter = {
        ...state.currentFilter,
        ...action.payload,
      };
    },
    setAvailableFilters: (state, action) => {
      state.availableFilters = {
        ...state.availableFilters,
        ...action.payload,
      };
      state.filterOptionsLoaded = true; // Mark filter options as loaded
    },
    addAvailableFilter: (state, action) => {
      const { type, value } = action.payload;
      if (
        type === "platform" &&
        !state.availableFilters.platforms.includes(value)
      ) {
        state.availableFilters.platforms.push(value);
      } else if (
        type === "location" &&
        !state.availableFilters.locations.includes(value)
      ) {
        state.availableFilters.locations.push(value);
      } else if (
        type === "transaction_type" &&
        !state.availableFilters.transactionTypes.includes(value)
      ) {
        state.availableFilters.transactionTypes.push(value);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetch all filter options
      .addCase(fetchAllFilterOptions.fulfilled, (state, action) => {
        // Update available filters with complete lists from Firestore
        state.availableFilters = action.payload;
        state.filterOptionsLoaded = true;
      })
      .addCase(fetchAllFilterOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFilterOptions.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Handle regular posts
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
      // Handle platform filter results
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

            // Update current filter
            state.currentFilter.platform = action.payload.filterValue;
          } else {
            state.items = action.payload;
          }
        }

        state.loading = false;
        state.initialFetchDone = true;
        state.activeFilter = "platform";
        state.filterApplied = true;
      })
      .addCase(fetchGamePostsByPlatform.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGamePostsByPlatform.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // Handle location filter results
      .addCase(fetchGamePostsByLocation.fulfilled, (state, action) => {
        if (action.payload) {
          if (action.payload.items) {
            state.items = action.payload.items;
            state.searchResultsCount = action.payload.total || 0;

            if (action.payload.total !== undefined) {
              state.totalPages = Math.ceil(
                action.payload.total / state.gamePostsPerPage
              );
            }

            // Add console.log to debug
            console.log("Setting location to:", action.payload.filterValue);
            // Update current filter - make sure this is happening
            state.currentFilter.location = action.payload.filterValue;
          } else {
            state.items = action.payload;
          }
        }
        state.loading = false;
        state.initialFetchDone = true;
        state.activeFilter = "location";
        state.filterApplied = true;
      })
      .addCase(fetchGamePostsByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGamePostsByLocation.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // Handle transaction type filter results
      .addCase(fetchGamePostsByTransactionType.fulfilled, (state, action) => {
        if (action.payload) {
          if (action.payload.items) {
            state.items = action.payload.items;
            state.searchResultsCount = action.payload.total || 0;

            if (action.payload.total !== undefined) {
              state.totalPages = Math.ceil(
                action.payload.total / state.gamePostsPerPage
              );
            }

            // Update current filter
            state.currentFilter.transaction_type = action.payload.filterValue;
          } else {
            state.items = action.payload;
          }
        }
        state.loading = false;
        state.initialFetchDone = true;
        state.activeFilter = "transaction_type";
        state.filterApplied = true;
      })
      .addCase(fetchGamePostsByTransactionType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGamePostsByTransactionType.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // Handle multi-filter results
      .addCase(fetchGamePostsWithMultipleFilters.fulfilled, (state, action) => {
        if (action.payload) {
          if (action.payload.items) {
            state.items = action.payload.items;
            state.searchResultsCount = action.payload.total || 0;

            if (action.payload.total !== undefined) {
              state.totalPages = Math.ceil(
                action.payload.total / state.gamePostsPerPage
              );
            }

            // Update current filters
            if (action.payload.filters) {
              state.currentFilter = {
                ...state.currentFilter,
                ...action.payload.filters,
              };
            }
          } else {
            state.items = action.payload;
          }
        }
        state.loading = false;
        state.initialFetchDone = true;
        state.activeFilter = "multi";
        state.filterApplied = true;
      })
      .addCase(fetchGamePostsWithMultipleFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGamePostsWithMultipleFilters.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // Handle clear filters
      .addCase(clearAllFilters.fulfilled, (state) => {
        state.filterApplied = false;
        state.activeFilter = null;
        state.currentFilter = {
          platform: null,
          location: null,
          transaction_type: null,
        };
      });
  },
});

export const {
  setCurrentPage,
  setTotalPages,
  setTotalGamePosts,
  resetState,
  clearCurrentPost,
  clearSelectedPosts,
  setSearchQuery,
  setFilterApplied,
  setActiveFilter,
  setSearchResultsCount,
  clearPaginationCache,
  // Filter management
  setCurrentFilter,
  setAvailableFilters,
  addAvailableFilter,
} = gamePostsFilterSlice.actions;

export default gamePostsFilterSlice.reducer;
