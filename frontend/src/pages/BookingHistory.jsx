import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getToken } from "../utils/auth";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadBookings() {
      try {
        const token = getToken();
        if (!token) {
          toast.error("Please log in to view your bookings.");
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:5000/api/bookings/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch bookings");

        const sorted = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.date) - new Date(a.date))
          : [];

        setBookings(sorted);
      } catch (err) {
        toast.error(err.message || "Could not load bookings");
      } finally {
        setIsLoading(false);
      }
    }

    loadBookings();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading your bookings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          My Bookings
        </h2>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No bookings yet.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-5"
              >
                <p className="mb-1">
                  <span className="font-semibold">Service:</span>{" "}
                  {b.service?.title || "N/A"}
                </p>

                <p className="mb-1">
                  <span className="font-semibold">Date:</span>{" "}
                  {b.date ? new Date(b.date).toLocaleString() : "N/A"}
                </p>

                <p className="mb-1">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`capitalize px-2 py-1 rounded text-sm ${
                      b.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : b.status === "accepted"
                        ? "bg-blue-100 text-blue-700"
                        : b.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </p>

                <p className="mb-1">
                  <span className="font-semibold">Provider:</span>{" "}
                  {b.service?.provider?.user?.name ||
                    b.service?.provider?.name ||
                    "Unknown"}
                </p>

                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {b.address || "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
