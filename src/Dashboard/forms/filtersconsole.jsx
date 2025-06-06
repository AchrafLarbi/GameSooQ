import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConsolePost,
  fetchConsolePostsByLocation,
  fetchConsolePostsByStorage,
  fetchConsolePostsWithMultipleFilters,
  clearAllFilters,
  setCurrentFilter,
  fetchAllFilterOptions,
} from "@/features/consolePostSlice";

const AdvancedFilterComponentConsole = () => {
  const dispatch = useDispatch();
  const {
    availableFilters,
    currentFilter,
    filterApplied = false,
    activeFilter = null,
    searchResultsCount = 0,
    initialFetchDone = false,
    filterOptionsLoaded,
    currentPage,
    ConsolePostPerPage,
  } = useSelector((state) => state.consolePosts || {});

  // State for dropdown visibility
  const [openDropdown, setOpenDropdown] = useState(null);

  // Local state for filter selections
  const [selectedFilters, setSelectedFilters] = useState({
    location: null,
    storage: null,
  });

  // Fetch initial data if needed
  useEffect(() => {
    // Load filter options on component mount
    if (!filterOptionsLoaded) {
      dispatch(fetchAllFilterOptions());
    }

    if (!initialFetchDone) {
      dispatch(fetchConsolePost());
    }
  }, [dispatch, initialFetchDone, filterOptionsLoaded]);

  // Update local state when redux state changes
  useEffect(() => {
    console.log("Available filters updated:", availableFilters);

    setSelectedFilters({
      location: currentFilter.location,
      storage: currentFilter.storage,
    });
  }, [currentFilter, availableFilters]);

  // Toggle dropdown visibility
  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Handle individual filter changes
  const handleFilterChange = (filterType, value) => {
    // Update local state
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value === prev[filterType] ? null : value,
    }));

    // Auto-close dropdown after selection
    setOpenDropdown(null);
  };

  // Apply selected filters
  const applyFilters = () => {
    const activeFilters = Object.entries(selectedFilters).filter(
      // eslint-disable-next-line no-unused-vars
      ([_, value]) => value !== null
    ).length;

    // Update the current filter in Redux
    dispatch(setCurrentFilter(selectedFilters));

    // No filters selected, clear all filters
    if (activeFilters === 0) {
      dispatch(
        clearAllFilters({ page: currentPage, limit: ConsolePostPerPage })
      );
      return;
    }

    // If multiple filters are selected, use the combined filter function
    if (activeFilters > 1) {
      dispatch(
        fetchConsolePostsWithMultipleFilters({
          filters: selectedFilters,
          page: 1, // Always start from page 1 when applying new filters
          limit: ConsolePostPerPage,
        })
      );
      return;
    }

    // Handle single filter cases
    if (selectedFilters.storage) {
      dispatch(
        fetchConsolePostsByStorage({
          storage: selectedFilters.storage,
          page: 1, // Always start from page 1 when applying new filters
          limit: ConsolePostPerPage,
        })
      );
    } else if (selectedFilters.location) {
      dispatch(
        fetchConsolePostsByLocation({
          location: selectedFilters.location,
          page: 1, // Always start from page 1 when applying new filters
          limit: ConsolePostPerPage,
        })
      );
    }
  };

  // Handle page changes with active filters
  useEffect(() => {
    if (filterApplied && currentPage > 1) {
      const activeFilters = Object.entries(currentFilter).filter(
        // eslint-disable-next-line no-unused-vars
        ([_, value]) => value !== null
      ).length;

      if (activeFilters > 1) {
        dispatch(
          fetchConsolePostsWithMultipleFilters({
            filters: currentFilter,
            page: currentPage,
            limit: ConsolePostPerPage,
          })
        );
      } else if (currentFilter.storage) {
        dispatch(
          fetchConsolePostsByStorage({
            storage: currentFilter.storage,
            page: currentPage,
            limit: ConsolePostPerPage,
          })
        );
      } else if (currentFilter.location) {
        dispatch(
          fetchConsolePostsByLocation({
            location: currentFilter.location,
            page: currentPage,
            limit: ConsolePostPerPage,
          })
        );
      }
    }
  }, [currentPage, filterApplied, currentFilter, dispatch, ConsolePostPerPage]);

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedFilters({
      location: null,
      storage: null,
    });
    dispatch(clearAllFilters({ page: currentPage, limit: ConsolePostPerPage }));
  };

  return (
    <div className="bg-gray-400 rounded-lg shadow-md p-4 my-6 mx-6 ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Filter Console Posts
        </h2>
        {filterApplied && (
          <div className="text-sm text-gray-600">
            Showing {searchResultsCount} results
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {/* Location Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("location")}
            className="px-4 py-2 bg-white text-black border border-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-200 transition"
          >
            <span>Location</span>
            {selectedFilters.location && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                {selectedFilters.location}
              </span>
            )}
            <svg
              className={`w-4 h-4 transition-transform ${
                openDropdown === "location" ? "transform rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {openDropdown === "location" && (
            <div className="absolute bg-white z-10 mt-1 w-48  border border-gray-200 rounded-md shadow-lg">
              <div className="py-1 max-h-48 overflow-y-auto">
                {availableFilters.locations.map((location) => (
                  <button
                    key={location}
                    onClick={() => handleFilterChange("location", location)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      selectedFilters.location === location
                        ? "bg-green-50 text-green-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Transaction Type Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("storage")}
            className="px-4 py-2 bg-white text-black border border-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-200 transition"
          >
            <span>Storage</span>
            {selectedFilters.storage && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                {selectedFilters.storage}
              </span>
            )}
            <svg
              className={`w-4 h-4 transition-transform ${
                openDropdown === "storage" ? "transform rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {openDropdown === "storage" && (
            <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="py-1 max-h-48 overflow-y-auto">
                {availableFilters.storage.map((storage) => (
                  <button
                    key={storage}
                    onClick={() => handleFilterChange("storage", storage)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      selectedFilters.storage === storage
                        ? "bg-purple-50 text-purple-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Apply Filter Button */}
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            ></path>
          </svg>
          Apply Filters
        </button>

        {/* Clear Filter Button (only show if filters are applied) */}
        {(selectedFilters.location || selectedFilters.storage) && (
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
            Clear
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {(selectedFilters.location || selectedFilters.storage) && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
            Active Filters:
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedFilters.location && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                Location: {selectedFilters.location}
                <button
                  onClick={() =>
                    handleFilterChange("location", selectedFilters.location)
                  }
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </span>
            )}

            {selectedFilters.storage && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
                Storage: {selectedFilters.storage}
                <button
                  onClick={() =>
                    handleFilterChange("storage", selectedFilters.storage)
                  }
                  className="ml-2 text-purple-500 hover:text-purple-700"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Filter Status Information */}
      {filterApplied && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>
              {activeFilter === "multi"
                ? "Multiple filters applied"
                : `Filtering by ${activeFilter}`}
              {" - "}
              {searchResultsCount} result{searchResultsCount !== 1 ? "s" : ""}{" "}
              found
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilterComponentConsole;
