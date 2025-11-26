import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";

export default function Header() {
  const user = getUser();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const isUser = user?.role === "user";
  const isProvider = user?.role === "provider";
  const isAdmin = user?.role === "admin";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-600">
          UrbanEase
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/services" className="hover:text-green-600 font-medium">
            Services
          </Link>

          {isUser && (
            <Link to="/bookings" className="hover:text-green-600 font-medium">
              My Bookings
            </Link>
          )}

          {isProvider && (
            <>
              <Link to="/provider" className="hover:text-green-600 font-medium">
                Dashboard
              </Link>
              <Link
                to="/provider/add-service"
                className="hover:text-green-600 font-medium"
              >
                Add Service
              </Link>
              <Link
                to="/provider/bookings"
                className="hover:text-green-600 font-medium"
              >
                View Bookings
              </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin" className="hover:text-red-600 font-medium">
              Admin Dashboard
            </Link>
          )}

          {!user && (
            <Link
              to="/login"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Login
            </Link>
          )}

          {user && (
            <div className="relative">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center gap-2 font-medium hover:text-green-600"
              >
                <span>{user.name?.split(" ")[0]}</span>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="profile"
                  className="w-8 h-8 rounded-full border"
                />
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpenMenu(false)}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
