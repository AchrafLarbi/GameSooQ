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
  fetchConsolePost,
  fetchTotalConsolePostCount,
  deleteconsolepost,
  setCurrentPage,
  searchConsolePost,
  setFilterApplied,
  setTotalPages,
} from "@/features/consolePostSlice";
import ConsoleDetailsOverlay from "../components/ConsoleDetailsOverlay";

export default function UserPage() {
  const dispatch = useDispatch();
  const {
    items: ConsolePost,
    currentPage,
    totalPages,
    ConsolePostPerPage,
    loading,
    initialFetchDone,
    filterApplied,
  } = useSelector((state) => state.consolePosts);

  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [selectedConsolePost, setselectedConsolePost] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [loadingPosts] = useState(false);
  const [isAddButtonVisible] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Fetch total ConsolePost count initially
  useEffect(() => {
    if (isMounted && !initialFetchDone) {
      dispatch(fetchTotalConsolePostCount());
    }
  }, [dispatch, initialFetchDone, isMounted]);

  // Fetch ConsolePost based on page with or without search
  useEffect(() => {
    if (isMounted && initialFetchDone) {
      if (searchTerm.trim()) {
        dispatch(
          searchConsolePost({
            query: searchTerm,
            page: currentPage,
            limit: ConsolePostPerPage,
          })
        );
      } else {
        dispatch(
          fetchConsolePost({ page: currentPage, limit: ConsolePostPerPage })
        );
      }
    }
  }, [
    dispatch,
    currentPage,
    ConsolePostPerPage,
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
        dispatch(fetchTotalConsolePostCount()).then((action) => {
          if (action.payload) {
            const total = action.payload.total;
            dispatch(setTotalPages(Math.ceil(total / ConsolePostPerPage)));
            dispatch(fetchConsolePost({ page: 1, limit: ConsolePostPerPage }));
          }
        });
      } else {
        dispatch(
          searchConsolePost({
            query: value,
            page: 1,
            limit: ConsolePostPerPage,
          })
        );
      }
    }, 500);

    setSearchTimeout(timeoutId);
  };

  const handleUserClick = (ConsolePost) => {
    console.log(ConsolePost);
    setselectedConsolePost(ConsolePost);
    setOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setOverlayOpen(false);
    setselectedConsolePost(null);
  };

  const handleDelete = (ConsolePost) => {
    setselectedConsolePost(ConsolePost);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedConsolePost) {
      // Dispatch deleteUser with the current ConsolePost id
      await dispatch(deleteconsolepost(selectedConsolePost.id));
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
        accessorKey: "consolename",
        header: "Nom",
      },
      {
        accessorKey: "storage",
        header: "Storage",
      },
      {
        accessorKey: "price",
        header: "Prix",
        cell: ({ row }) => {
          const price = row.price;

          return <div className="font-medium">{price}</div>;
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const ConsolePost = row;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleUserClick(ConsolePost)}
                className="hover:text-gray-400"
              >
                <SquareArrowOutUpRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(ConsolePost)}
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
          filterApplied
            ? `ConsolePost Posts (Search: ${searchTerm})`
            : "ConsolePost Posts"
        }
        columns={columns}
        data={ConsolePost}
        searchKey="name"
        onSearch={handleSearchChange}
        value={searchTerm}
        loading={isLoading}
        onRowClick={handleUserClick}
        disappear={isAddButtonVisible}
      />
      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete ConsolePost"
        description={`Are you sure you want to delete ${
          selectedConsolePost?.name || "this ConsolePost"
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
        {ConsolePost.length > 0 &&
          ` • Showing ${ConsolePost.length} ConsolePost posts`}
      </div>

      {/* ConsolePost Detail Overlay */}
      {overlayOpen && selectedConsolePost && (
        <ConsoleDetailsOverlay
          selectedConsolePost={selectedConsolePost}
          onClose={handleCloseOverlay}
        />
      )}
    </div>
  );
}
