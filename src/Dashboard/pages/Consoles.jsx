"use client";

import { useState, useEffect, useMemo } from "react";
import { Edit, Trash2, Image, ArrowRight, ArrowLeft } from "lucide-react";
import { DataTable } from "@/Dashboard/components/Table";
import { Button } from "@/components/ui/button";
import { ConsoleForm } from "../forms/console-form";
import { DeleteConfirmation } from "@/Dashboard/components/delete-confirmation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConsoles,
  fetchTotalConsolesCount,
  addConsole,
  deleteConsole,
  updateConsole,
  setCurrentPage,
  searchConsoles,
  setFilterApplied,
  setTotalPages,
} from "@/features/consoleSlice";

export default function Consoles() {
  const dispatch = useDispatch();
  const {
    items: consoles,
    currentPage,
    totalPages,
    consolesPerPage,
    loading,
    initialFetchDone,
    filterApplied,
  } = useSelector((state) => state.consoles);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentConsole, setcurrentConsole] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isAddButtonVisible] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false); // Cleanup when component is unmounted
  }, []);

  // Fetch total console count initially (only when not done yet)
  useEffect(() => {
    if (isMounted && !initialFetchDone) {
      dispatch(fetchTotalConsolesCount());
    }
  }, [dispatch, initialFetchDone, isMounted]);

  // Effect for fetching consoles based on page (pagination) with or without search
  useEffect(() => {
    if (isMounted && initialFetchDone) {
      if (searchTerm.trim()) {
        // Search applied, fetch consoles with search query
        dispatch(
          searchConsoles({
            query: searchTerm,
            page: currentPage,
            limit: consolesPerPage,
          })
        );
      } else {
        // No search, fetch consoles normally
        dispatch(fetchConsoles({ page: currentPage, limit: consolesPerPage }));
      }
    }
  }, [
    dispatch,
    currentPage,
    consolesPerPage,
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
      dispatch(setCurrentPage(1)); // Reset to page 1 when searching
      dispatch(setFilterApplied(value.trim() !== ""));

      if (value.trim() === "") {
        // Reset the search and fetch all consoles
        dispatch(fetchTotalConsolesCount()).then((action) => {
          if (action.payload) {
            const total = action.payload.total;
            dispatch(setTotalPages(Math.ceil(total / consolesPerPage)));
            dispatch(fetchConsoles({ page: 1, limit: consolesPerPage }));
          }
        });
      } else {
        // Perform search if there is a value
        dispatch(
          searchConsoles({ query: value, page: 1, limit: consolesPerPage })
        );
        // The totalPages will be set in the reducer based on the search results
      }
    }, 500);

    setSearchTimeout(timeoutId);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Nom",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const console = row;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(console)}
                className="hover:text-gray-400"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(console)}
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

  const handleAdd = () => {
    setcurrentConsole(null);
    setIsFormOpen(true);
  };

  const handleEdit = (console) => {
    setcurrentConsole(console);

    setIsFormOpen(true);
  };

  const handleDelete = (console) => {
    setcurrentConsole(console);
    setIsDeleteOpen(true);
  };

  const handleSave = async (consoleData) => {
    if (currentConsole) {
      // Dispatch updateConsole with the current console id and new data
      await dispatch(updateConsole({ id: currentConsole.id, ...consoleData }));
    } else {
      // Dispatch addConsole to add a new console
      await dispatch(addConsole(consoleData));
    }
    setIsFormOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (currentConsole) {
      // Dispatch deleteConsole with the current console id
      await dispatch(deleteConsole(currentConsole.id));
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
        title={filterApplied ? `consoles (Search: ${searchTerm})` : "consoles"}
        columns={columns}
        data={consoles}
        searchKey="name"
        onAdd={handleAdd}
        onSearch={handleSearchChange}
        value={searchTerm}
        loading={loading}
        disappear={isAddButtonVisible}
      />

      <ConsoleForm
        console={currentConsole}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Console"
        description={`Are you sure you want to delete ${
          currentConsole?.name || "this console"
        }? This action cannot be undone.`}
      />

      <div className="mt-4 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || loading}
          className="hover:bg-gray-300 hover:text-black hover:border-zinc-700 text-zinc-950 border rounded-xl "
        >
          <ArrowLeft className="w-4 h-4" />
          Précédent
        </Button>

        <Button
          variant="outline"
          onClick={handleNextPage}
          disabled={currentPage === totalPages || loading}
          className="flex items-center gap-2 hover:bg-gray-300 hover:text-black hover:border-zinc-700 text-zinc-950 border rounded-xl"
        >
          Suivant
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-center text-sm text-gray-500">
        Page {currentPage} of {totalPages}
        {consoles.length > 0 && ` • Showing ${consoles.length} consoles`}
      </div>
    </div>
  );
}
