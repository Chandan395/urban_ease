import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Verify() {
  const [otpCode, setOtpCode] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem("pendingUserId");
    if (storedId) {
      setUserId(storedId);
    } else {
      toast.error("No pending user found. Please register or login again.");
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!otpCode) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code: otpCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.removeItem("pendingUserId");

      toast.success("Account verified successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Verification failed");
    }

    setIsLoading(false);
  }

  async function handleResend() {
    if (!userId) {
      toast.error("User not found. Please register again.");
      return;
    }

    setIsResending(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP");

      toast.success(data.message || "OTP sent successfully");
    } catch (err) {
      toast.error(err.message || "Failed to resend OTP");
    }

    setIsResending(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-white to-green-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Verify Your Account
        </h2>

        <input
          type="text"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          placeholder="Enter 6-digit OTP"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-green-500 outline-none"
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 rounded-md text-white font-medium transition ${
            isLoading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isLoading ? "Verifying..." : "Verify Account"}
        </button>

        <div className="text-center mt-5">
          <p className="text-sm text-gray-600">Didn’t receive the OTP?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className={`text-green-600 font-semibold hover:underline mt-1 ${
              isResending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isResending ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Verify;
