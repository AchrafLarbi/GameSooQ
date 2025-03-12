"use client";

import { useState, useEffect, useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import { DataTable } from "@/Dashboard/components/Table";
import { Button } from "@/components/ui/button";
import { GameForm } from "../forms/game-form";
import { DeleteConfirmation } from "@/Dashboard/components/delete-confirmation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGames,
  fetchTotalGamesCount,
  addGame,
  deleteGame,
  updateGame,
  setCurrentPage,
  searchGames,
  setFilterApplied,
  setTotalPages,
} from "@/features/gameSlice";

export default function GamesPage() {
  const dispatch = useDispatch();
  const {
    items: games,
    currentPage,
    totalPages,
    gamesPerPage,
    loading,
    initialFetchDone,
    filterApplied,
  } = useSelector((state) => state.games);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false); // Cleanup when component is unmounted
  }, []);

  // Fetch total game count initially (only when not done yet)
  useEffect(() => {
    if (isMounted && !initialFetchDone) {
      dispatch(fetchTotalGamesCount());
    }
  }, [dispatch, initialFetchDone, isMounted]);

  // Effect for fetching games based on page (pagination) without search
  useEffect(() => {
    if (isMounted && initialFetchDone && !searchTerm.trim()) {
      dispatch(fetchGames({ page: currentPage, limit: gamesPerPage }));
    }
  }, [
    dispatch,
    currentPage,
    gamesPerPage,
    initialFetchDone,
    searchTerm,
    isMounted,
  ]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear the previous timeout for debounce
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeoutId = setTimeout(() => {
      // Always reset to page 1 when search term changes
      dispatch(setCurrentPage(1));

      if (value.trim() === "") {
        // If search term is empty, reset filter and fetch all games
        dispatch(setFilterApplied(false));

        // First fetch the total games count to ensure correct pagination
        dispatch(fetchTotalGamesCount()).then(() => {
          // Then fetch the first page of games
          dispatch(fetchGames({ page: 1, limit: gamesPerPage }));

          // Make sure totalPages is updated based on the total games count
          dispatch(setTotalPages());
        });
      } else {
        // If search term is not empty, apply filter and search
        dispatch(setFilterApplied(true));

        // Dispatch the search games action
        dispatch(
          searchGames({
            query: value,
            page: 1,
            limit: gamesPerPage,
          })
        );
        // The thunk already handles updating searchResultsCount and totalPages
      }
    }, 500); // 500ms debounce

    setSearchTimeout(timeoutId);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
          const game = row;
          return (
            <Button asChild variant="outline">
              <a
                href={game?.image || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                View Image
              </a>
            </Button>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const game = row;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(game)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(game)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const handleAdd = () => {
    setCurrentGame(null);
    setIsFormOpen(true);
  };

  const handleEdit = (game) => {
    setCurrentGame(game);
    setIsFormOpen(true);
  };

  const handleDelete = (game) => {
    setCurrentGame(game);
    setIsDeleteOpen(true);
  };

  const handleSave = async (gameData) => {
    if (currentGame) {
      // Dispatch updateGame with the current game id and new data
      await dispatch(updateGame({ id: currentGame.id, ...gameData }));
    } else {
      // Dispatch addGame to add a new game
      await dispatch(addGame(gameData));
    }
    setIsFormOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (currentGame) {
      // Dispatch deleteGame with the current game id
      await dispatch(deleteGame(currentGame.id));
      setIsDeleteOpen(false);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      dispatch(setCurrentPage(nextPage));

      if (filterApplied) {
        // Fetch next page of search results
        dispatch(
          searchGames({
            query: searchTerm,
            page: nextPage,
            limit: gamesPerPage,
          })
        );
      } else {
        // Fetch next page of normal games
        dispatch(fetchGames({ page: nextPage, limit: gamesPerPage }));
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      dispatch(setCurrentPage(prevPage));

      if (filterApplied) {
        // Fetch previous page of search results
        dispatch(
          searchGames({
            query: searchTerm,
            page: prevPage,
            limit: gamesPerPage,
          })
        );
      } else {
        // Fetch previous page of normal games
        dispatch(fetchGames({ page: prevPage, limit: gamesPerPage }));
      }
    }
  };

  return (
    <div className="space-y-6">
      <DataTable
        title={filterApplied ? `Games (Search: ${searchTerm})` : "Games"}
        columns={columns}
        data={games}
        searchKey="name"
        onAdd={handleAdd}
        onSearch={handleSearchChange}
        value={searchTerm}
        loading={loading}
      />

      <GameForm
        game={currentGame}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Game"
        description={`Are you sure you want to delete ${
          currentGame?.name || "this game"
        }? This action cannot be undone.`}
      />

      <div className="mt-4 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || loading}
        >
          Précédent
        </Button>

        <Button
          variant="outline"
          onClick={handleNextPage}
          disabled={currentPage === totalPages || loading}
        >
          Suivant
        </Button>
      </div>

      <div className="text-center text-sm text-gray-500">
        Page {currentPage} of {totalPages}
        {games.length > 0 && ` • Showing ${games.length} games`}
      </div>
    </div>
  );
}
