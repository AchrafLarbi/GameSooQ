"use client";

const UserDetailsOverlay = ({ selectedUser, onClose }) => {
  const {
    name,
    rating,
    profile_picture,
    gender,
    email,
    birthDate,
    phone_number,
    user_id,
  } = selectedUser;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="relative h-auto bg-opacity-95 bg-black text-white rounded-lg overflow-hidden shadow-lg">
        {/* Rating badge */}
        <div className="absolute top-4 left-4 bg-purple-600 text-white text-sm font-semibold px-3 py-1 rounded-full h-8 w-20 z-10 text-right">
          {rating > 0 ? rating.toFixed(1) : "4.4"}
        </div>
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-white z-10"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {/* Profile image */}
        <div className="flex justify-center mt-16 mb-6">
          <div className="relative">
            <div className="rounded-full flex items-center justify-center">
              {profile_picture ? (
                <img
                  src={profile_picture || "/placeholder.svg"}
                  alt={name}
                  className="w-44 h-44 rounded-full object-cover"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-700 text-white flex items-center justify-center text-2xl font-bold">
                  {name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Username */}
        <div className="text-center px-4 pb-2">
          <h2 className="text-3xl font-bold">{name}</h2>
        </div>
        {/* Gender badge */}
        <div className="flex justify-center mt-4 mb-6">
          <div className="px-4 py-1 text-sm text-purple-700 border border-purple-700 rounded-full outline outline-2 outline-purple-700">
            {gender || "Homme"}
          </div>
        </div>
        {/* User details */}
        <div className="p-4 bg-black border-t border-gray-800">
          {/* User details in 2x2 grid */}
          <div className="grid grid-cols-2 gap-y-4 py-2 px-2">
            {/* Email */}
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
                  stroke="white"
                  strokeOpacity="0.5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-base">
                {email || "islemcharafeddine@gmail.com"}
              </span>
            </div>
            {/* Birth Date */}
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                  stroke="white"
                  strokeOpacity="0.5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-base">
                {birthDate
                  ? new Date(
                      birthDate.split("/").reverse().join("-")
                    ).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "03 juin 2003"}
              </span>
            </div>
            {/* Phone */}
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.31 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z"
                  stroke="white"
                  strokeOpacity="0.5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-base">
                {phone_number
                  ? phone_number.replace(
                      /(\d{3})(\d{2})(\d{2})(\d{2})(\d{2})/,
                      "$1 - (0) $2 $3 $4 $5"
                    )
                  : "+213 - (0) 6 48 55 26 87"}
              </span>
            </div>

            {/* ID */}
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.5 11.5H20.5M5.5 5.5H18.5C19.6046 5.5 20.5 6.39543 20.5 7.5V16.5C20.5 17.6046 19.6046 18.5 18.5 18.5H5.5C4.39543 18.5 3.5 17.6046 3.5 16.5V7.5C3.5 6.39543 4.39543 5.5 5.5 5.5Z"
                  stroke="white"
                  strokeOpacity="0.5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-base">
                ID : {user_id || "QoikdHidspm5Jiai"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsOverlay;
