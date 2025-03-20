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
  fetchUsers,
  fetchTotalUsersCount,
  deleteUser,
  setCurrentPage,
  searchUsers,
  setFilterApplied,
  setTotalPages,
} from "@/features/userSlice";
import UserDetailsOverlay from "../components/UserDetailsOverlay";

export default function UserPage() {
  const dispatch = useDispatch();
  const {
    items: User,
    currentPage,
    totalPages,
    UserPerPage,
    loading,
    initialFetchDone,
    filterApplied,
  } = useSelector((state) => state.users);

  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [loadingPosts] = useState(false);
  const [isAddButtonVisible] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Fetch total User count initially
  useEffect(() => {
    if (isMounted && !initialFetchDone) {
      dispatch(fetchTotalUsersCount());
    }
  }, [dispatch, initialFetchDone, isMounted]);

  // Fetch Users based on page with or without search
  useEffect(() => {
    if (isMounted && initialFetchDone) {
      if (searchTerm.trim()) {
        dispatch(
          searchUsers({
            query: searchTerm,
            page: currentPage,
            limit: UserPerPage,
          })
        );
      } else {
        dispatch(fetchUsers({ page: currentPage, limit: UserPerPage }));
      }
    }
  }, [
    dispatch,
    currentPage,
    UserPerPage,
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
        dispatch(fetchTotalUsersCount()).then((action) => {
          if (action.payload) {
            const total = action.payload.total;
            dispatch(setTotalPages(Math.ceil(total / UserPerPage)));
            dispatch(fetchUsers({ page: 1, limit: UserPerPage }));
          }
        });
      } else {
        dispatch(searchUsers({ query: value, page: 1, limit: UserPerPage }));
      }
    }, 500);

    setSearchTimeout(timeoutId);
  };

  const handleUserClick = (UserPost) => {
    setSelectedUser(UserPost);
    setOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setOverlayOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = (User) => {
    setSelectedUser(User);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      // Dispatch deleteUser with the current User id
      await dispatch(deleteUser(selectedUser.id));
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
        accessorKey: "name",
        header: "Nom",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "gender",
        header: "Genre",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const UserPost = row;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleUserClick(UserPost)}
                className="hover:text-gray-400"
              >
                <SquareArrowOutUpRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(UserPost)}
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
          filterApplied ? `User Posts (Search: ${searchTerm})` : "User Posts"
        }
        columns={columns}
        data={User}
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
        title="Delete User"
        description={`Are you sure you want to delete ${
          selectedUser?.name || "this User"
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
        {User.length > 0 && ` • Showing ${User.length} User posts`}
      </div>

      {/* User Detail Overlay */}
      {overlayOpen && selectedUser && (
        <UserDetailsOverlay
          selectedUser={selectedUser}
          onClose={handleCloseOverlay}
        />
      )}
    </div>
  );
}
