import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const API_BASE_URL =
    import.meta.env.VITE_API_URL ;

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/user/reset-password/${token}`,
        { password }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-24 px-4">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* PASSWORD FIELD */}
          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-gray-500 pr-12 text-black"
            />

            {/* SHOW/HIDE BUTTON */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 hover:text-black"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="bg-gray-800 text-white py-2 rounded-lg hover:bg-black transition font-semibold"
          >
            Reset Password
          </button>

        </form>

        {/* MESSAGE */}
        {message && (
          <p className="text-center mt-4 text-sm text-green-600">
            {message}
          </p>
        )}

      </div>
    </div>
  );
};

export default ResetPassword;