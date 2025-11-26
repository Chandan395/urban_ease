import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getToken, getUser } from "../utils/auth";

const ProviderDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadServices() {
      setLoading(true);

      try {
        const token = getToken();
        const user = getUser();

        if (!token || !user) {
          toast.error("Please login to access this page");
          navigate("/login");
          return;
        }

        if (user.role !== "provider") {
          toast.error("Not authorized to view this page");
          navigate("/");
          return;
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [allRes, providerRes] = await Promise.all([
          fetch("http://localhost:5000/api/services", { headers }),
          fetch("http://localhost:5000/api/provider/me", { headers }),
        ]);

        const allData = await allRes.json();
        const provider = await providerRes.json();

        if (!allRes.ok) throw new Error(allData.message || "Failed to fetch services");
        if (!providerRes.ok) throw new Error(provider.message || "Failed to fetch provider profile");

        const myServices = Array.isArray(allData)
          ? allData.filter(
            (s) =>
              String(s.provider?._id || s.provider) ===
              String(provider._id || provider)
          )
          : [];

        setServices(myServices);
      } catch (err) {
        toast.error(err.message || "Failed to fetch services");
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, [navigate]);

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    setDeletingId(id);

    try {
      const token = getToken();
      if (!token) {
        toast.error("Please login");
        navigate("/login");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete service");

      toast.success("Service deleted");
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      toast.error(err.message || "Failed to delete service");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading your services...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Your Services</h1>
          <Link
            to="/provider/add-service"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
          >
            + Add Service
          </Link>
        </div>

        {services.length === 0 ? (
          <p className="text-gray-600 text-center py-10">
            You haven't added any services yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s._id}
                className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                {s.image && (
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                )}

                <h2 className="text-lg font-semibold text-gray-800">{s.title}</h2>
                <p className="text-sm text-gray-600">{s.category}</p>
                <p className="mt-2 text-gray-800 font-medium">₹{s.price}</p>

                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/provider/edit-service/${s._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(s._id)}
                    disabled={deletingId === s._id}
                    className={`font-medium ${deletingId === s._id
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-600 hover:text-red-800"
                      }`}
                  >
                    {deletingId === s._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProviderDashboard;