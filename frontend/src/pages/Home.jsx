import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUser } from "../utils/auth";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const isUser = user?.role === "user";
  const isProvider = user?.role === "provider";
  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-linear-to-br from-green-50 to-white">
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-12">
        <div className="max-w-2xl space-y-6">
          {!user ? (
            <>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight">
                Find Trusted <span className="text-green-600">Professionals</span>
                <br /> Near You
              </h1>

              <p className="text-lg text-gray-600">
                Book experts for cleaning, beauty, repairs, appliances, fitness, and more — all in one place.
              </p>

              <ul className="text-gray-500 list-disc list-inside text-sm">
                <li>Verified service providers</li>
                <li>Instant online booking</li>
                <li>Secure payments & updates</li>
                <li>24/7 support</li>
              </ul>

              <div className="flex flex-wrap gap-4 mt-6">
                <Link
                  to="/services"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-700 shadow-lg transition"
                >
                  Explore Services
                </Link>

                <Link
                  to="/register"
                  className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-50 transition"
                >
                  Become a Provider
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
                Welcome back, <span className="text-green-600">{user.name}</span> 👋
              </h1>

              <p className="text-lg text-gray-600">
                {isUser && "Discover trusted professionals near you and book services instantly."}
                {isProvider && "Manage your services and keep track of new bookings easily."}
                {isAdmin && "Monitor platform activity and manage users and services."}
              </p>

              <div className="flex flex-wrap gap-4 mt-6">
                {isUser && (
                  <>
                    <Link
                      to="/services"
                      className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-700 shadow-lg transition"
                    >
                      Browse Services
                    </Link>
                    <Link
                      to="/bookings"
                      className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-50 transition"
                    >
                      My Bookings
                    </Link>
                  </>
                )}

                {isProvider && (
                  <>
                    <Link
                      to="/provider"
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 shadow-lg transition"
                    >
                      Provider Dashboard
                    </Link>

                    <Link
                      to="/provider/add-service"
                      className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition"
                    >
                      Add New Service
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-red-700 shadow-lg transition"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="hidden md:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
          alt="Urban services"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute bottom-8 left-8 text-white max-w-md">
          <h3 className="text-2xl font-semibold">Trusted Experts. Instant Bookings.</h3>
          <p className="text-sm text-gray-200 mt-1">
            Join thousands of users simplifying their daily tasks with UrbanEase.
          </p>

          <ul className="mt-3 text-sm text-gray-300 list-disc list-inside">
            <li>Real-time availability</li>
            <li>Transparent pricing</li>
            <li>Ratings and reviews</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
