import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function loadBookings() {
      try {
        const auth = JSON.parse(localStorage.getItem("user"));
        if (!auth || auth.role !== "provider") {
          toast.error("Access denied");
          return;
        }

        const res = await fetch("http://localhost:5000/api/bookings/provider", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch bookings");

        setBookings(
          data.sort((a, b) => new Date(b.date) - new Date(a.date))
        );
      } catch (err) {
        toast.error(err.message || "Error loading bookings");
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  async function updateStatus(id, newStatus) {
    const auth = JSON.parse(localStorage.getItem("user"));
    setUpdatingId(id);

    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      toast.success(`Booking ${newStatus.replace("_", " ")}`);

      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: newStatus } : b
        )
      );
    } catch (err) {
      toast.error(err.message || "Failed to update booking");
    }

    setUpdatingId(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500 text-lg">
        Loading your bookings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Service Bookings
        </h2>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-500">
            No one booked your services yet.
          </p>
        ) : (
          <div className="space-y-5">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="border border-gray-200 rounded-lg p-5 shadow-sm bg-white"
              >
                <p>
                  <span className="font-semibold">Service:</span>{" "}
                  {b.service?.title || "N/A"}
                </p>

                <p>
                  <span className="font-semibold">Booked By:</span>{" "}
                  {b.user?.name || "Unknown User"}
                </p>

                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(b.date).toLocaleString()}
                </p>

                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {b.address || "N/A"}
                </p>

                <p className="mb-3">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`capitalize px-2 py-1 rounded text-sm ${b.status === "scheduled"
                      ? "bg-yellow-100 text-yellow-700"
                      : b.status === "in_progress"
                        ? "bg-blue-100 text-blue-700"
                        : b.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {b.status.replace("_", " ")}
                  </span>
                </p>

                <div className="flex gap-3">
                  {b.status === "scheduled" && (
                    <>
                      <button
                        disabled={updatingId === b._id}
                        onClick={() => updateStatus(b._id, "in_progress")}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        {updatingId === b._id ? "Updating..." : "Accept"}
                      </button>

                      <button
                        disabled={updatingId === b._id}
                        onClick={() => updateStatus(b._id, "cancelled")}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {b.status === "in_progress" && (
                    <>
                      <button
                        disabled={updatingId === b._id}
                        onClick={() => updateStatus(b._id, "completed")}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Mark Completed
                      </button>

                      <button
                        disabled={updatingId === b._id}
                        onClick={() => updateStatus(b._id, "cancelled")}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProviderBookings;