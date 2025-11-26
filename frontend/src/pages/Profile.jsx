import React from "react";
import { getUser, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = getUser();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4 py-10">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          My Profile
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="text-lg font-semibold">{user.name}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="text-lg">{user.email}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Mobile</p>
            <p className="text-lg">{user.mobile}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Role</p>
            <p className="text-lg capitalize">{user.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;