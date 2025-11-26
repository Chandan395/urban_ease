import React, { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";

function ServiceList() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch("http://localhost:5000/api/services");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load services");

        setServices(data);
        setFilteredServices(data);
      } catch {
        alert("Failed to load services");
      } finally {
        setIsLoading(false);
      }
    }

    loadServices();
  }, []);

  useEffect(() => {
    const q = searchTerm.toLowerCase();
    const list = services.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
    setFilteredServices(list);
  }, [searchTerm, services]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading services...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 via-white to-gray-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
            Find Your Perfect Service
          </h2>
          <p className="text-gray-600 text-lg">
            Browse our wide range of trusted home and personal care services.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for cleaning, beauty, electrician..."
            className="w-full sm:w-2/3 lg:w-1/2 px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        {filteredServices.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No services match your search.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="transform transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceList;
