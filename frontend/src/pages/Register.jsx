import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiLock, FiUserPlus } from "react-icons/fi";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    const body = { name, email, mobile, password, role };

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.userId) {
        localStorage.setItem("pendingUserId", data.userId);
        toast.success("Registration successful! Please verify your email.");
        navigate("/verify");
      } else {
        toast.error(data.message || "Unexpected response. Please try again.");
      }
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-green-50 via-white to-green-100 px-4 sm:px-6">
      <form
        onSubmit={submit}
        className="bg-white shadow-2xl rounded-2xl p-8 sm:p-10 w-full max-w-md border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-3">
            <FiUserPlus className="text-green-600 text-4xl" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Create Account
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-2">
            Join UrbanEase to book or offer services
          </p>
        </div>

        <div className="relative mb-4">
          <FiUser className="absolute left-3 top-3.5 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 sm:py-3 focus:ring-2 focus:ring-green-500 outline-none text-gray-700 text-sm sm:text-base"
          />
        </div>

        <div className="relative mb-4">
          <FiMail className="absolute left-3 top-3.5 text-gray-400 text-lg" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 sm:py-3 focus:ring-2 focus:ring-green-500 outline-none text-gray-700 text-sm sm:text-base"
          />
        </div>

        <div className="relative mb-4">
          <FiPhone className="absolute left-3 top-3.5 text-gray-400 text-lg" />
          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 sm:py-3 focus:ring-2 focus:ring-green-500 outline-none text-gray-700 text-sm sm:text-base"
          />
        </div>

        <div className="relative mb-4">
          <FiLock className="absolute left-3 top-3.5 text-gray-400 text-lg" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 sm:py-3 focus:ring-2 focus:ring-green-500 outline-none text-gray-700 text-sm sm:text-base"
          />
        </div>

        <div className="relative mb-6">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-3 focus:ring-2 focus:ring-green-500 outline-none text-gray-700 text-sm sm:text-base"
          >
            <option value="user">User</option>
            <option value="provider">Provider</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 sm:py-3 rounded-md text-white font-semibold transition ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;