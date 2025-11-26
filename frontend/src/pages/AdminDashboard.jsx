import React, { useEffect, useState } from "react";
import { Users, Briefcase, ClipboardList, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { getToken, getUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      try {
        const token = getToken();
        const user = getUser();

        if (!token || !user) {
          toast.error("Please login again");
          navigate("/login");
          return;
        }

        if (user.role !== "admin") {
          toast.error("Not authorized");
          navigate("/");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const [u, s, b] = await Promise.all([
          fetch("http://localhost:5000/api/admin/users", { headers }),
          fetch("http://localhost:5000/api/admin/services", { headers }),
          fetch("http://localhost:5000/api/admin/bookings", { headers }),
        ]);

        const usersData = await u.json();
        const servicesData = await s.json();
        const bookingsData = await b.json();

        if (!u.ok) throw new Error(usersData.message || "Failed to load users");
        if (!s.ok) throw new Error(servicesData.message || "Failed to load services");
        if (!b.ok) throw new Error(bookingsData.message || "Failed to load bookings");

        setUsers(usersData);
        setServices(servicesData);
        setBookings(bookingsData);
      } catch (err) {
        toast.error(err.message || "Couldn't load dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [navigate]);

  async function handleDeleteService(id) {
    if (!window.confirm("Delete this service?")) return;

    setDeletingId(id);

    try {
      const token = getToken();
      if (!token) {
        toast.error("Session expired");
        navigate("/login");
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/admin/service/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      setServices((prev) => prev.filter((s) => s._id !== id));
      toast.success("Service deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete service");
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Admin Dashboard
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <SummaryCard icon={<Users size={28} />} title="Total Users" value={users.length} />
          <SummaryCard icon={<Briefcase size={28} />} title="Total Services" value={services.length} />
          <SummaryCard icon={<ClipboardList size={28} />} title="Total Bookings" value={bookings.length} />
        </div>

        <Section title="Users">
          {users.length === 0 ? (
            <p className="text-center text-gray-500">No users found.</p>
          ) : (
            <Table headers={["Name", "Email", "Role"]}>
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        u.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : u.role === "provider"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </Section>

        <Section title="Services">
          {services.length === 0 ? (
            <p className="text-center text-gray-500">No services found.</p>
          ) : (
            <Table headers={["Title", "Category", "Provider", "Actions"]}>
              {services.map((service) => (
                <tr key={service._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{service.title}</td>
                  <td className="p-3">{service.category}</td>
                  <td className="p-3 text-gray-600">
                    {service.provider?.user?.name || "N/A"}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 text-sm"
                      disabled={deletingId === service._id}
                    >
                      <Trash2 size={14} />
                      {deletingId === service._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </Section>

        <Section title="Bookings">
          {bookings.length === 0 ? (
            <p className="text-center text-gray-500">No bookings found.</p>
          ) : (
            <Table headers={["Service", "User", "Status"]}>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{b.service?.title || "N/A"}</td>
                  <td className="p-3">{b.user?.name || "N/A"}</td>
                  <td className="p-3 capitalize">{b.status}</td>
                </tr>
              ))}
            </Table>
          )}
        </Section>
      </div>
    </div>
  );
};

function SummaryCard({ icon, title, value }) {
  return (
    <div className="p-5 rounded-xl shadow-sm bg-white border hover:shadow-md">
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-12">
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      {children}
    </section>
  );
}

function Table({ headers, children }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            {headers.map((head, i) => (
              <th key={i} className="p-3">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
