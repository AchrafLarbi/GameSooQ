"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserById } from "../../features/userSlice"; // Update path as needed

const GameDetailsOverlay = ({ selectedGame, onClose }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("Loading...");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    }
  };

  // Destructure the game properties from selectedGame
  const {
    condition,
    created_At,
    delivery,
    description,
    gamename,
    images,
    location,
    platform,
    post_id,
    transaction_details,
    transaction_type,
    user_id,
  } = selectedGame || {};

  // Fetch user data when component mounts or user_id changes
  useEffect(() => {
    if (user_id) {
      dispatch(fetchUserById(user_id))
        .unwrap()
        .then((userData) => {
          setUsername(userData.name || userData.username || "Unknown User");
        })
        .catch((error) => {
          console.error("Failed to fetch user:", error);
          setUsername("Unknown User");
        });
    }
  }, [dispatch, user_id]);

  return (
    // Overlay wrapper - centered on screen with semi-transparent background
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
      onClick={onClose}
    >
      {/* Overlay container */}
      <div
        className="flex flex-col max-w-5xl w-[95%] mx-auto bg-black text-white overflow-y-auto max-h-[95vh] rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main image background section with title on top */}
        <div className="relative">
          {/* Background image - increased height for fuller appearance */}
          <div
            className="w-full h-[50vh] bg-cover bg-center transition-all duration-300"
            style={{
              backgroundImage:
                images && images.length > 0
                  ? `url(${images[currentImageIndex]})`
                  : "none",
            }}
          >
            {/* Semi-transparent gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/50"></div>

            {/* Title and close button positioned on top of image */}
            <div className="absolute inset-x-0 top-0 p-4 flex justify-between items-start z-10">
              <h1 className="text-3xl font-bold text-white drop-shadow-md">
                {gamename || "Game Title"}
              </h1>
              <button
                className="text-3xl font-bold text-white hover:text-gray-300 bg-black/60 rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-2 border-white/30"
                onClick={onClose}
              >
                ×
              </button>
            </div>

            {/* Navigation arrows - improved styling */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 z-10 transition-all"
              onClick={prevImage}
            >
              &lt;
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 z-10 transition-all"
              onClick={nextImage}
            >
              &gt;
            </button>

            {/* Pagination dots - improved styling */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3 z-10">
              {images &&
                images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                      index === currentImageIndex
                        ? "bg-white scale-110"
                        : "bg-gray-400/70 hover:bg-gray-300"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  ></div>
                ))}
              {(!images || images.length === 0) && (
                <div className="w-3 h-3 rounded-full bg-white"></div>
              )}
            </div>
          </div>
        </div>

        {/* Info bar */}
        <div className="flex justify-between bg-black p-3">
          <div className="bg-purple-600 text-white px-4 py-2 rounded-full">
            {transaction_type === "sell" ? "Vente" : "Exchange"}
          </div>
          <div className="bg-purple-600 text-white px-4 py-2 rounded-full">
            {platform && platform.length > 0 ? platform[0] : "Platform"}
          </div>
        </div>

        {/* Date and seller info */}
        <div className="p-4 bg-black border-t border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg mx-6 flex flex-row gap-2">
              <span>
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 42 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.8125 5.25V9.1875M30.1875 5.25V9.1875M5.25 32.8125V13.125C5.25 10.9504 7.01288 9.1875 9.1875 9.1875H32.8125C34.9871 9.1875 36.75 10.9504 36.75 13.125V32.8125M5.25 32.8125C5.25 34.9871 7.01288 36.75 9.1875 36.75H32.8125C34.9871 36.75 36.75 34.9871 36.75 32.8125M5.25 32.8125V19.6875C5.25 17.5129 7.01288 15.75 9.1875 15.75H32.8125C34.9871 15.75 36.75 17.5129 36.75 19.6875V32.8125M21 22.3125H21.0131V22.3256H21V22.3125ZM21 26.25H21.0131V26.2631H21V26.25ZM21 30.1875H21.0131V30.2006H21V30.1875ZM17.0625 26.25H17.0756V26.2631H17.0625V26.25ZM17.0625 30.1875H17.0756V30.2006H17.0625V30.1875ZM13.125 26.25H13.1381V26.2631H13.125V26.25ZM13.125 30.1875H13.1381V30.2006H13.125V30.1875ZM24.9375 22.3125H24.9506V22.3256H24.9375V22.3125ZM24.9375 26.25H24.9506V26.2631H24.9375V26.25ZM24.9375 30.1875H24.9506V30.2006H24.9375V30.1875ZM28.875 22.3125H28.8881V22.3256H28.875V22.3125ZM28.875 26.25H28.8881V26.2631H28.875V26.25Z"
                    stroke="white"
                    strokeOpacity="0.5"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>{created_At || "Date"}</span>
            </div>
            <div className="border border-purple-600 text-purple-600 px-4 py-2 rounded-full">
              {condition || "Condition"}
            </div>
          </div>

          <div className="flex justify-between items-center py-4 mx-6">
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 42 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M27.5625 10.5C27.5625 14.1244 24.6243 17.0625 21 17.0625C17.3756 17.0625 14.4375 14.1244 14.4375 10.5C14.4375 6.87563 17.3756 3.9375 21 3.9375C24.6243 3.9375 27.5625 6.87563 27.5625 10.5Z"
                    stroke="white"
                    strokeOpacity="0.5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.87695 35.2069C7.99999 28.0646 13.8282 22.3125 21 22.3125C28.1719 22.3125 34.0002 28.0648 34.123 35.2074C30.1281 37.0405 25.6837 38.0625 21.0005 38.0625C16.317 38.0625 11.8721 37.0403 7.87695 35.2069Z"
                    stroke="white"
                    strokeOpacity="0.5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-xl">{username}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 42 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.744 5.25H9.1875C7.01288 5.25 5.25 7.01288 5.25 9.1875V16.744C5.25 17.7883 5.66484 18.7898 6.40327 19.5283L23.1702 36.2952C24.3929 37.5179 26.2848 37.8205 27.7314 36.8734C31.3724 34.4897 34.4897 31.3724 36.8734 27.7314C37.8205 26.2848 37.5179 24.3929 36.2952 23.1702L19.5283 6.40327C18.7898 5.66484 17.7883 5.25 16.744 5.25Z"
                    stroke="white"
                    strokeOpacity="0.5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.5 10.5H10.5131V10.5131H10.5V10.5Z"
                    stroke="white"
                    strokeOpacity="0.5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-xl">ID : {post_id || "ID"}</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-4 mx-6">
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 42 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M26.25 18.375C26.25 21.2745 23.8995 23.625 21 23.625C18.1005 23.625 15.75 21.2745 15.75 18.375C15.75 15.4755 18.1005 13.125 21 13.125C23.8995 13.125 26.25 15.4755 26.25 18.375Z"
                    stroke="white"
                    strokeOpacity="0.5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M34.125 18.375C34.125 30.8737 21 38.0625 21 38.0625C21 38.0625 7.875 30.8737 7.875 18.375C7.875 11.1263 13.7513 5.25 21 5.25C28.2487 5.25 34.125 11.1263 34.125 18.375Z"
                    stroke="white"
                    strokeOpacity="0.5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-xl">{location || "Location"}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 36 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M33.75 11.125L18 1.9375L2.25 11.125M33.75 11.125L18 20.3125M33.75 11.125V26.875L18 36.0625M2.25 11.125L18 20.3125M2.25 11.125V26.875L18 36.0625M18 20.3125V36.0625"
                    stroke="white"
                    strokeOpacity="0.5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-xl">
                {delivery === "Oui" ? "Delivery Available" : "No Delivery"}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-zinc-800 text-white p-4 m-4 rounded-xl">
          <p className="text-xl ">
            {description || "No description available."}
          </p>
        </div>

        {/* Price */}
        <div className="bg-zinc-800 text-white p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {transaction_type === "sell" ? "Prix" : "Jeu"}
          </h2>
          <div className="text-3xl font-bold">
            {transaction_details || "0"}
            {transaction_type === "sell" && (
              <span className="text-purple-400"> DA</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailsOverlay;
