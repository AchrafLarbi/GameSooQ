import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  limit,
  startAfter,
} from "firebase/firestore";

// Fetch games with pagination
export const fetchGames = createAsyncThunk(
  "Games/fetch",
  async ({ page = 1, limit: pageLimit = 10 }) => {
    const gamesRef = collection(db, "Games");
    let q = query(gamesRef, limit(pageLimit));

    if (page > 1) {
      // Fetch the last document from the previous page to use as the starting point
      const previousPageQuery = query(gamesRef, limit((page - 1) * pageLimit));
      const previousPageSnapshot = await getDocs(previousPageQuery);
      const lastVisible =
        previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];
      q = query(gamesRef, startAfter(lastVisible), limit(pageLimit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

// Add a new game
export const addGame = createAsyncThunk("Games/add", async (game) => {
  const docRef = await addDoc(collection(db, "Games"), game);
  return { id: docRef.id, ...game };
});

// Delete a game
export const deleteGame = createAsyncThunk("Games/delete", async (id) => {
  await deleteDoc(doc(db, "Games", id));
  return id;
});

// Update a game
export const updateGame = createAsyncThunk(
  "Games/update",
  async ({ id, ...gameData }) => {
    const gameRef = doc(db, "Games", id);
    await updateDoc(gameRef, gameData); // Update the document in Firestore
    return { id, ...gameData }; // Return the updated game data
  }
);

// Fetch total number of games for pagination
export const fetchTotalGamesCount = createAsyncThunk(
  "Games/fetchTotalCount",
  async () => {
    const gamesRef = collection(db, "Games");
    const snapshot = await getDocs(gamesRef);
    return snapshot.size; // Total number of games
  }
);

const Gameslice = createSlice({
  name: "Games",
  initialState: {
    items: [], // List of games
    loading: false, // Loading state
    error: null, // Error state
    currentPage: 1, // Current page number
    totalPages: 1, // Total number of pages
    gamesPerPage: 10, // Number of games per page
    totalGames: 0, // Total number of games
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload; // Update the current page
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.items = action.payload; // Update the games list
        state.loading = false;
      })
      .addCase(fetchGames.pending, (state) => {
        state.loading = true; // Set loading state
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.error = action.error.message; // Set error state
        state.loading = false;
      })
      .addCase(addGame.fulfilled, (state, action) => {
        state.items.push(action.payload); // Add the new game
      })
      .addCase(deleteGame.fulfilled, (state, action) => {
        state.items = state.items.filter((game) => game.id !== action.payload); // Remove the deleted game
      })
      .addCase(updateGame.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (game) => game.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload; // Update the game in the list
        }
      })
      .addCase(fetchTotalGamesCount.fulfilled, (state, action) => {
        state.totalGames = action.payload; // Update total number of games
        state.totalPages = Math.ceil(action.payload / state.gamesPerPage); // Calculate total pages
      });
  },
});

export const { setCurrentPage } = Gameslice.actions;
export default Gameslice.reducer;
