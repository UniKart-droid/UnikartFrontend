import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_URL ;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/user/forgot-password`,
        { email }
      );

      setMessage(res.data.message);
      setEmail("");
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        setMessage("Backend server is not running or unreachable.");
      } else {
        setMessage(
          error.response?.data?.message || "Something went wrong"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-[90%] max-w-md">
        
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          Forgot Password
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border rounded mb-3 outline-none focus:border-gray-800 text-black"
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-gray-800 text-white py-2 rounded transition-all ${
              loading ? "opacity-50" : "hover:bg-black"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p
            className={`text-center mt-3 text-sm font-medium ${
              message.includes("sent")
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;