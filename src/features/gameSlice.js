import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  limit, // Import the limit function
} from "firebase/firestore";

// Fetch only 10 games
export const fetchGames = createAsyncThunk("Games/fetch", async () => {
  const q = query(collection(db, "Games"), limit(10)); // Add limit to the query
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

export const addGame = createAsyncThunk("Games/add", async (game) => {
  const docRef = await addDoc(collection(db, "Games"), game);
  return { id: docRef.id, ...game };
});

export const deleteGame = createAsyncThunk("Games/delete", async (id) => {
  await deleteDoc(doc(db, "Games", id));
  return id;
});

const Gameslice = createSlice({
  name: "Games",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addGame.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteGame.fulfilled, (state, action) => {
        state.items = state.items.filter((game) => game.id !== action.payload);
      });
  },
});

export default Gameslice.reducer;
