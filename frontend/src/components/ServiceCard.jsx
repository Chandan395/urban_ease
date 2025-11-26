import React from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";

export default function ServiceCard({ service }) {
  const navigate = useNavigate();
  const user = getUser();

  function handleClick() {
    if (!user) {
      alert("Please log in to view and book this service.");
      navigate("/login");
    } else {
      navigate(`/services/${service._id}`);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-xl transition duration-300 flex flex-col justify-between">
      {service?.image && (
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-48 object-cover rounded-md mb-3"
        />
      )}

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {service.title}
        </h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {service.description || "No description available."}
        </p>
        <p className="text-gray-700 text-sm mb-1">
          <strong>Category:</strong> {service.category}
        </p>
        <p className="text-green-600 font-semibold text-lg">
          ₹{service.price ? service.price.toLocaleString() : "N/A"}
        </p>
      </div>

      <button
        onClick={handleClick}
        className="mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-medium"
      >
        View & Book
      </button>
    </div>
  );
}
