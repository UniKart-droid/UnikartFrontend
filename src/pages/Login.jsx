import React, { useState } from "react";
import { useFormik } from "formik";
import { loginSchema } from "../schemas/loginSchema";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_URL ;

  const {
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    submitCount,
  } = useFormik({
    initialValues,
    validationSchema: loginSchema,

    onSubmit: async (values, action) => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/user/login`,
          values
        );

        console.log("LOGIN SUCCESS RESPONSE:", res.data);

        const userData = Array.isArray(res.data)
          ? res.data[0]
          : res.data.user || res.data;

        const idToSave =
          userData?._id ||
          userData?.teacher_id ||
          userData?.student_id ||
          userData?.admin_id ||
          userData?.id;

        if (idToSave) {
          localStorage.setItem(
            "token",
            res.data.token || userData?.token || "no-token"
          );

          localStorage.setItem("userId", idToSave);

          localStorage.setItem(
            "user",
            JSON.stringify(userData)
          );

          console.log(
            "Full User data saved to LocalStorage:",
            userData
          );

          window.dispatchEvent(new Event("storage"));

          alert("Login Successful!");

          // Role-based Navigation
          const userRole =
            userData?.role || userData?.sel_role;

          if (userRole === "teacher") {
            navigate("/teacher/upload-notes");
          } else {
            navigate("/");
          }

          action.resetForm();
        } else {
          console.error(
            "Error: No valid ID found in the response object."
          );

          alert(
            "Login failed: User identifier (ID) not found in server response."
          );
        }
      } catch (error) {
        console.error(
          "LOGIN ERROR:",
          error.response?.data || error.message
        );

        alert(
          error.response?.data?.message ||
            "Login failed. Please check credentials."
        );
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-[90%] max-w-md p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h1>

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="flex flex-col"
        >
          <label className="text-gray-700 font-semibold mb-1">
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={() => setActiveField("email")}
            className="p-3 mb-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-500 text-black"
          />

          {errors.email &&
            (activeField === "email" ||
              submitCount > 0) && (
              <p className="text-red-500 text-sm mb-2">
                {errors.email}
              </p>
            )}

          <label className="text-gray-700 font-semibold mb-1">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={() => setActiveField("password")}
            className="p-3 mb-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-500 text-black"
          />

          {errors.password &&
            (activeField === "password" ||
              submitCount > 0) && (
              <p className="text-red-500 text-sm mb-2">
                {errors.password}
              </p>
            )}

          <div className="text-right mb-2">
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-blue-600 cursor-pointer hover:underline"
            >
              Forgot Password?
            </span>
          </div>

          <button
            type="submit"
            className="mt-4 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-black transition-all"
          >
            Login
          </button>

          <p className="text-center text-sm mt-4 text-gray-600">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-gray-800 font-semibold cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;