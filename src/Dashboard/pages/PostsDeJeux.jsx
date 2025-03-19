"use client";

import { useState, useEffect, useMemo } from "react";
import {
  SquareArrowOutUpRight,
  Trash2,
  X,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { DataTable } from "@/Dashboard/components/Table";
import { Button } from "@/components/ui/button";
import { DeleteConfirmation } from "@/Dashboard/components/delete-confirmation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGamePosts,
  fetchGamePostById,
  fetchTotalGamePostsCount,
  fetchGamePostsByIds,
  fetchGamePostsByPlatform,
  fetchGamePostsByUserId,
  deleteGamePost,
  setCurrentPage,
  searchGamePosts,
  setFilterApplied,
  setTotalPages,
} from "@/features/gamePostSlice";
import GameDetailsOverlay from "../components/GameDetailsOverlay";

export default function GamePostsPage() {
  const dispatch = useDispatch();
  const {
    items: gamePosts,
    currentPage,
    totalPages,
    gamePostsPerPage,
    loading,
    error,
    initialFetchDone,
    searchResultsCount,
    filterApplied,
  } = useSelector((state) => state.gamePosts);

  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Fetch total game count initially
  useEffect(() => {
    if (isMounted && !initialFetchDone) {
      dispatch(fetchTotalGamePostsCount());
    }
  }, [dispatch, initialFetchDone, isMounted]);

  // Fetch games based on page with or without search
  useEffect(() => {
    if (isMounted && initialFetchDone) {
      if (searchTerm.trim()) {
        dispatch(
          searchGamePosts({
            query: searchTerm,
            page: currentPage,
            limit: gamePostsPerPage,
          })
        );
      } else {
        dispatch(
          fetchGamePosts({ page: currentPage, limit: gamePostsPerPage })
        );
      }
    }
  }, [
    dispatch,
    currentPage,
    gamePostsPerPage,
    initialFetchDone,
    searchTerm,
    isMounted,
  ]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeoutId = setTimeout(() => {
      dispatch(setCurrentPage(1));
      dispatch(setFilterApplied(value.trim() !== ""));

      if (value.trim() === "") {
        dispatch(fetchTotalGamePostsCount()).then((action) => {
          if (action.payload) {
            const total = action.payload.total;
            dispatch(setTotalPages(Math.ceil(total / gamePostsPerPage)));
            dispatch(fetchGamePosts({ page: 1, limit: gamePostsPerPage }));
          }
        });
      } else {
        dispatch(
          searchGamePosts({ query: value, page: 1, limit: gamePostsPerPage })
        );
      }
    }, 500);

    setSearchTimeout(timeoutId);
  };

  const handleGameClick = (gamePost) => {
    setSelectedGame(gamePost);
    setOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setOverlayOpen(false);
    setSelectedGame(null);
  };

  const handleDelete = (game) => {
    setSelectedGame(game);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedGame) {
      // Dispatch deleteGame with the current game id
      await dispatch(deleteGamePost(selectedGame.id));
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

  const columns = useMemo(
    () => [
      {
        accessorKey: "gamename",
        header: "Game Title",
      },
      {
        accessorKey: "transaction_type",
        header: "Type",
      },
      {
        accessorKey: "transaction_details",
        header: "Price/Game",
        cell: ({ row }) => {
          const price = row.transaction_details;

          return (
            <div className="font-medium">
              {price} {row.transaction_type === "sell" ? "DA" : ""}{" "}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const gamePost = row;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleGameClick(gamePost)}
                className="hover:text-gray-400"
              >
                <SquareArrowOutUpRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(gamePost)}
                className="hover:text-red-600 "
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

  // Show loading state while fetching posts
  const isLoading = loading || loadingPosts;

  return (
    <div className="space-y-6 relative">
      <DataTable
        title={
          filterApplied ? `Game Posts (Search: ${searchTerm})` : "Game Posts"
        }
        columns={columns}
        data={gamePosts}
        searchKey="gamename"
        onSearch={handleSearchChange}
        value={searchTerm}
        loading={isLoading}
        onRowClick={handleGameClick}
      />
      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Game"
        description={`Are you sure you want to delete ${
          selectedGame?.name || "this game"
        }? This action cannot be undone.`}
      />

      <div className="mt-4 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || isLoading}
          className="hover:bg-gray-300 hover:text-black hover:border-zinc-700 text-zinc-950 border rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Précédent
        </Button>

        <Button
          variant="outline"
          onClick={handleNextPage}
          disabled={currentPage === totalPages || isLoading}
          className="flex items-center gap-2 hover:bg-gray-300 hover:text-black hover:border-zinc-700 text-zinc-950 border rounded-xl"
        >
          Suivant
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="text-center text-sm text-gray-500">
        Page {currentPage} of {totalPages}
        {gamePosts.length > 0 && ` • Showing ${gamePosts.length} game posts`}
      </div>

      {/* Game Detail Overlay */}
      {overlayOpen && selectedGame && (
        <GameDetailsOverlay
          selectedGame={selectedGame}
          onClose={handleCloseOverlay}
        />
      )}
    </div>
  );
}
