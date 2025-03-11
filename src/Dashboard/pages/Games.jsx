"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { DataTable } from "@/Dashboard/components/Table";
import { Button } from "@/components/ui/button";
import { GameForm } from "../forms/game-form";
import { DeleteConfirmation } from "@/Dashboard/components/delete-confirmation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGames,
  addGame,
  deleteGame,
  updateGame,
  setCurrentPage,
  fetchTotalGamesCount,
} from "@/features/gameSlice";

export default function GamesPage() {
  const dispatch = useDispatch();
  const {
    items: games,
    currentPage,
    totalPages,
    gamesPerPage,
    loading,
  } = useSelector((state) => state.games);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);

  useEffect(() => {
    dispatch(fetchGames({ page: currentPage, limit: gamesPerPage }));
    dispatch(fetchTotalGamesCount());
  }, [dispatch, currentPage, gamesPerPage]);

  const columns = [
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
          <img
            src={game?.image || "https://via.placeholder.com/100"} // Fallback image if game.image is undefined
            alt={game?.name || "Game image"}
            className="w-16 h-16 object-cover rounded"
          />
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
  ];

  const handleAdd = () => {
    setCurrentGame(null);
    setIsFormOpen(true);
  };

  const handleEdit = (game) => {
    setCurrentGame(game);
    setIsFormOpen(true);
  };

  const handleDelete = (game) => {
    setCurrentGame(game); // Set the game to be deleted
    setIsDeleteOpen(true); // Open the delete confirmation dialog
  };

  const handleSave = async (gameData) => {
    if (currentGame) {
      // Update existing game
      await dispatch(updateGame({ id: currentGame.id, ...gameData }));
    } else {
      // Add new game
      await dispatch(addGame(gameData));
    }
    setIsFormOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (currentGame) {
      await dispatch(deleteGame(currentGame.id));
      setIsDeleteOpen(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  return (
    <div className="space-y-6">
      <DataTable
        title="Games"
        columns={columns}
        data={games}
        searchKey="name"
        onAdd={handleAdd}
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

      <div className="mt-4 flex justify-between">
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
    </div>
  );
}
