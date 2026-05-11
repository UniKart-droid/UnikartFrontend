import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import Footer from "../component/Footer";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const UploadNotice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ DEPLOYED BACKEND URL
  const API_URL =
    `${import.meta.env.VITE_API_URL || "https://unikartweb.onrender.com"}/api/notices`;

  const validationSchema = Yup.object({
    title: Yup.string()
      .trim()
      .min(3, "Minimum 3 characters")
      .max(80, "Max 80 characters")
      .matches(/[a-zA-Z]/, "Please enter valid title")
      .required("Title is required"),

    description: Yup.string()
      .trim()
      .min(10, "Minimum 10 characters")
      .required("Description is required"),

    file: Yup.mixed()
      .test("fileType", "Only PDF allowed", (file) => {
        if (!file) return true;
        return file.type === "application/pdf";
      })
      .test("fileSize", "File too large (max 5MB)", (file) => {
        if (!file) return true;
        return file.size <= 5 * 1024 * 1024;
      }),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      file: null,
    },

    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      try {
        const formData = new FormData();

        formData.append("title", values.title);
        formData.append("description", values.description);

        // Backend upload.single("pdfUrl")
        if (values.file) {
          formData.append("pdfUrl", values.file);
        }

        // Token
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("adminToken");

        const response = await axios.post(API_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 201 || response.status === 200) {
          const savedNotice = response.data.notice;

          setNotices([savedNotice, ...notices]);

          resetForm();

          alert("Notice uploaded successfully!");
        }
      } catch (error) {
        console.error("Database Error:", error);

        const errorMsg =
          error.response?.data?.message ||
          "Server Error. Check terminal.";

        alert(errorMsg);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleFileChange = (e) => {
    formik.setFieldValue("file", e.target.files[0]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex flex-1">
        <AdminSidebar />

        <div className="flex-1 mt-24 px-8 py-8">
          <div className="max-w-2xl bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-black mb-2">
              Upload New Notice
            </h2>

            <p className="text-gray-900 font-medium mb-8 text-sm">
              Authorized Admin Access Only
            </p>

            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-5"
            >
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="Notice Title"
                  {...formik.getFieldProps("title")}
                  className="border border-gray-400 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-orange-500 outline-none text-black placeholder:text-gray-500 font-medium"
                />

                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-600 text-sm font-bold mt-1">
                    {formik.errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Description
                </label>

                <textarea
                  name="description"
                  rows={4}
                  placeholder="Notice Description"
                  {...formik.getFieldProps("description")}
                  className="border border-gray-400 px-4 py-2 rounded-lg w-full resize-none focus:ring-2 focus:ring-orange-500 outline-none text-black placeholder:text-gray-500 font-medium"
                />

                {formik.touched.description &&
                  formik.errors.description && (
                    <p className="text-red-600 text-sm font-bold mt-1">
                      {formik.errors.description}
                    </p>
                  )}
              </div>

              {/* File */}
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Attachment (PDF Only)
                </label>

                <input
                  type="file"
                  name="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-black font-medium
                  file:mr-4 file:py-2 file:px-4 
                  file:rounded-full file:border-0 
                  file:text-sm file:font-bold 
                  file:bg-black file:text-white 
                  hover:file:bg-gray-800 cursor-pointer"
                />

                {formik.errors.file && (
                  <p className="text-red-600 text-sm font-bold mt-1">
                    {formik.errors.file}
                  </p>
                )}
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className={`mt-2 px-6 py-3 rounded-lg font-bold text-white shadow-md transition-all active:scale-95 ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {loading ? "Uploading..." : "Upload Notice"}
              </button>
            </form>

            {/* Recently Uploaded Preview */}
            {notices.length > 0 && (
              <div className="mt-10 border-t border-gray-300 pt-8">
                <h3 className="text-2xl font-bold mb-6 text-black">
                  Recently Uploaded
                </h3>

                <ul className="flex flex-col gap-4">
                  {notices.map((notice, index) => (
                    <li
                      key={notice._id || index}
                      className="bg-gray-50 p-5 rounded-xl border border-gray-300 shadow-sm"
                    >
                      <h4 className="font-extrabold text-black text-lg">
                        {notice.title}
                      </h4>

                      <p className="text-gray-900 mt-1 font-medium">
                        {notice.description}
                      </p>

                      {notice.pdfUrl && (
                        <div className="mt-3 flex items-center gap-2 text-orange-700 text-sm font-bold">
                          <span className="bg-orange-100 border border-orange-200 px-2 py-1 rounded">
                            📄 {notice.pdfUrl}
                          </span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UploadNotice;
