import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    async function loadService() {
      try {
        const res = await fetch(`http://localhost:5000/api/services/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");
        setService(data);
      } catch (err) {
        alert("Failed to load service details");
        console.log(err)
      } finally {
        setIsLoading(false);
      }
    }

    loadService();
  }, [id]);

  async function handleBooking() {
    const auth = JSON.parse(localStorage.getItem("user"));

    if (!auth) {
      alert("Please log in to book a service.");
      return navigate("/login");
    }

    if (auth.role !== "user") {
      alert("Only users can book services.");
      return;
    }

    if (!date || !address) {
      alert("Please enter date and address.");
      return;
    }

    setIsBooking(true);

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ serviceId: id, date, address }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Service booked successfully!");
      setDate("");
      setAddress("");
    } catch (err) {
      alert(err.message || "Booking failed");
    }

    setIsBooking(false);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading service details...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Service not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{service.title}</h2>
        <p className="text-gray-600 mb-4">{service.description}</p>

        <p className="text-gray-800 mb-2">
          <strong>Price:</strong> ₹{service.price}
        </p>

        <p className="text-gray-700 mb-4">
          <strong>Provider:</strong> {service.provider?.user?.name || "Unknown"}
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">Book This Service</h3>

        <div className="flex flex-col gap-3">
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="text"
            placeholder="Your Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            onClick={handleBooking}
            disabled={isBooking}
            className={`py-2 rounded-md text-white font-medium transition ${
              isBooking
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isBooking ? "Booking..." : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetails;
