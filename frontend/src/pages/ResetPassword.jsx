import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();

    if (!email || !code || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          newPassword: password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");

      toast.success("Password reset successful. Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Reset failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Reset Password
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Reset Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter reset code"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
