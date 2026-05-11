import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import Footer from "../component/Footer";
import axios from "axios";

const AdminUpdateNotice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    _id: null,
    title: "",
    description: "",
    file: null,
  });

  const API = "https://unikartweb-production.up.railway.app";
  const API_URL = `${API}/api/notices`;

  const fetchNotices = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      setNotices(response.data);
      setLoading(false);

    } catch (err) {
      console.error("Error fetching notices:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // DELETE FUNCTIONALITY
  const handleDelete = async (id) => {

    if (window.confirm("Are you sure you want to delete this notice?")) {

      try {
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("adminToken");

        await axios.delete(`${API_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Notice deleted successfully!");

        // UI se instantly remove
        setNotices(
          notices.filter((notice) => notice._id !== id)
        );

      } catch (error) {
        console.error("Delete Error:", error);

        alert(
          error.response?.data?.message ||
          "Failed to delete notice."
        );
      }
    }
  };

  const handleEdit = (notice) => {

    setForm({
      _id: notice._id,
      title: notice.title,
      description: notice.description,
      file: null,
    });

    setIsEditing(true);
  };

  const handleCancel = () => {

    setIsEditing(false);

    setForm({
      _id: null,
      title: "",
      description: "",
      file: null,
    });
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {

    setForm({
      ...form,
      file: e.target.files[0],
    });
  };

  const handleUpdate = async () => {

    if (!form.title || !form.description) {
      alert("Please fill all required fields!");
      return;
    }

    try {

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);

      if (form.file) {
        formData.append("pdfUrl", form.file);
      }

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("adminToken");

      const res = await axios.put(
        `${API_URL}/${form._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {

        alert("Notice updated successfully!");

        setIsEditing(false);

        fetchNotices();
      }

    } catch (error) {

      console.error("Update Error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to update notice."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <div className="flex flex-1">

        <AdminSidebar />

        <div className="flex-1 mt-28 px-4 py-6">

          <h2 className="text-3xl font-bold text-gray-700 mb-8">
            Manage Notices
          </h2>

          {loading ? (

            <p className="text-orange-500 font-bold animate-pulse">
              Loading notices...
            </p>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {notices.map((notice) => (

                <div
                  key={notice._id}
                  className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition border border-gray-200"
                >

                  <div>

                    <h3 className="text-xl font-semibold text-gray-800">
                      {notice.title}
                    </h3>

                    <p className="text-gray-600 mt-2 line-clamp-3">
                      {notice.description}
                    </p>

                    {notice.pdfUrl && (
                      <p className="text-gray-500 text-sm mt-2 italic">
                        📄 {notice.pdfUrl}
                      </p>
                    )}

                  </div>

                  <div className="mt-6 flex gap-3 justify-end">

                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(notice)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-bold text-sm"
                    >
                      Edit
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(notice._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-bold text-sm"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && notices.length === 0 && (
            <p className="text-gray-500 mt-6 text-center">
              No notices available.
            </p>
          )}

        </div>
      </div>

      <Footer />

      {/* Edit Modal */}
      {isEditing && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">

            <h3 className="text-2xl font-bold mb-4">
              Edit Notice
            </h3>

            <div className="flex flex-col gap-4">

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none resize-none"
              />

              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf"
                className="w-full border px-4 py-2 rounded-lg"
              />

            </div>

            <div className="flex justify-end gap-4 mt-6">

              <button
                onClick={handleCancel}
                className="px-6 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-bold"
              >
                Save Changes
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUpdateNotice;