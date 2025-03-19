"use client";

import { useState, useEffect, useMemo } from "react";
import { Edit, Trash2, X, ArrowRight, ArrowLeft } from "lucide-react";
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
        header: "Price",
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
                <Edit className="h-4 w-4" />
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
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            {/* Close button */}
            <button
              onClick={handleCloseOverlay}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-4">
              {/* Game title */}
              <h1 className="text-4xl font-bold text-white mb-8">
                {selectedGame.gameName}
              </h1>

              {/* Image gallery */}
              <div className="w-full h-64 mb-8 bg-gray-800 flex items-center justify-center">
                {selectedGame.images && selectedGame.images.length > 0 ? (
                  <img
                    src={selectedGame.images[0]}
                    alt={selectedGame.gameName}
                    className="h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400">No Image Available</span>
                )}
              </div>

              {/* Navigation indicators */}
              <div className="flex justify-between mb-6">
                <button className="rounded-full bg-gray-700 p-2 hover:bg-gray-600">
                  <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <div className="flex gap-2">
                  {selectedGame.images &&
                    selectedGame.images.map((_, index) => (
                      <span
                        key={index}
                        className={`h-2 w-2 rounded-full ${
                          index === 0 ? "bg-white" : "bg-gray-500"
                        }`}
                      />
                    ))}
                  {(!selectedGame.images ||
                    selectedGame.images.length === 0) && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
                <button className="rounded-full bg-gray-700 p-2 hover:bg-gray-600">
                  <ArrowRight className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Labels */}
              <div className="flex gap-4 mb-6">
                <div className="bg-purple-700 text-white py-2 px-4 rounded-full">
                  For Sale
                </div>
                <div className="bg-purple-700 text-white py-2 px-4 rounded-full">
                  {selectedGame.platform}
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center text-white mb-4">
                <span className="text-lg">{selectedGame.createdAt}</span>
              </div>

              {/* User info and metadata */}
              <div className="grid grid-cols-2 gap-4 border-b border-gray-700 pb-6 mb-6">
                <div className="flex items-center text-white">
                  <span className="mr-2">👤</span>
                  <span>{selectedGame.sellerName}</span>
                </div>
                <div className="flex items-center text-white">
                  <span className="mr-2">🏷️</span>
                  <span>ID: {selectedGame.id}</span>
                </div>
                <div className="flex items-center text-white">
                  <span className="mr-2">📍</span>
                  <span>{selectedGame.location}</span>
                </div>
                <div className="flex items-center text-white">
                  <span className="mr-2">🚚</span>
                  <span>
                    {selectedGame.deliveryAvailable
                      ? "Delivery Available"
                      : "No Delivery"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <p className="text-white">{selectedGame.description}</p>
              </div>

              {/* Price */}
              <div className="flex justify-between items-center">
                <h2 className="text-white text-3xl font-bold">Price</h2>
                <div className="text-right">
                  <span className="text-white text-3xl font-bold">
                    {selectedGame.price}
                  </span>
                  <span className="text-purple-500 text-3xl font-bold ml-2">
                    DA
                  </span>
                </div>
              </div>

              {/* Condition badge */}
              <div className="mt-6 text-right">
                <span className="border border-purple-500 text-purple-400 rounded-full py-2 px-4 inline-block">
                  {selectedGame.condition}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
