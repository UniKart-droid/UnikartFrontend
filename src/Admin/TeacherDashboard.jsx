import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import Footer from "../component/Footer";
import axios from "axios";

const TeacherDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // For View/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  // ✅ DEPLOYED BACKEND URL
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://unikartweb-production.up.railway.app";

  // Fetch approved teachers
  const fetchTeachers = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/user/approved-teachers`
      );

      setTeachers(Array.isArray(res.data.teachers) ? res.data.teachers : []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setTeachers([]);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure to delete this teacher?"
    );

    if (confirmDelete) {
      try {
        await axios.patch(
          `${API_BASE_URL}/api/user/reject-user/${id}`
        );

        setTeachers(
          teachers.filter((teacher) => teacher._id !== id)
        );
      } catch (error) {
        console.error("Error deleting teacher:", error);
      }
    }
  };

  // Handle View
  const handleView = async (id) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/user/user/${id}`
      );

      setSelectedUser(res.data.user);
      setIsEditMode(false);
      setIsModalOpen(true);
    } catch (error) {
      alert("Error fetching details");
    }
  };

  // Handle Edit Click
  const handleEditClick = (teacher) => {
    setSelectedUser(teacher);

    setFormData({
      name: teacher.name,
      email: teacher.email,
    });

    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Handle Update Submit
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${API_BASE_URL}/api/user/update-user/${selectedUser._id}`,
        formData
      );

      alert("Teacher updated successfully!");

      setIsModalOpen(false);

      fetchTeachers(); // Refresh list
    } catch (error) {
      alert("Update failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex flex-1 flex-col md:flex-row">
        <AdminSidebar />

        <div className="flex-1 mt-20 p-4 md:p-8 w-full">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">
            Teacher Dashboard
          </h2>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white rounded-3xl shadow-lg overflow-x-auto border border-gray-100">
            <table className="w-full text-left min-w-full">
              <thead className="bg-gray-50 text-gray-700 text-sm uppercase tracking-wide">
                <tr>
                  <th className="p-5">Name</th>
                  <th className="p-5">Email</th>
                  <th className="p-5">ID Number</th>
                  <th className="p-5 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {teachers.map((teacher) => (
                  <tr
                    key={teacher._id}
                    className="border-t hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-5 font-semibold text-gray-800">
                      {teacher.name}
                    </td>

                    <td className="p-5 text-gray-600">
                      {teacher.email}
                    </td>

                    <td className="p-5 font-mono text-sm text-orange-600 font-bold">
                      {teacher.teacher_id ||
                        teacher._id.slice(-6).toUpperCase()}
                    </td>

                    <td className="p-5 flex justify-center gap-3">
                      <button
                        onClick={() => handleView(teacher._id)}
                        className="px-4 py-1.5 text-sm bg-orange-500 text-white rounded-lg"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleEditClick(teacher)}
                        className="px-4 py-1.5 text-sm border border-blue-400 text-blue-500 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(teacher._id)}
                        className="px-4 py-1.5 text-sm border border-red-400 text-red-500 rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW */}
          <div className="md:hidden flex flex-col gap-4">
            {teachers.map((teacher) => (
              <div
                key={teacher._id}
                className="bg-white p-5 rounded-xl shadow-md border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {teacher.name}
                  </h3>

                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold">
                    ID:{" "}
                    {teacher.teacher_id ||
                      teacher._id.slice(-6).toUpperCase()}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mt-1">
                  {teacher.email}
                </p>

                <div className="flex gap-2 mt-4 flex-wrap">
                  <button
                    onClick={() => handleView(teacher._id)}
                    className="flex-1 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleEditClick(teacher)}
                    className="flex-1 px-3 py-1.5 border border-blue-400 text-blue-500 rounded-lg text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(teacher._id)}
                    className="flex-1 px-3 py-1.5 border border-red-400 text-red-500 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {teachers.length === 0 && (
            <p className="text-gray-500 mt-6 text-center">
              No approved teachers available.
            </p>
          )}
        </div>
      </div>

      {/* VIEW/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Teacher" : "Teacher Details"}
            </h3>

            {isEditMode ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>

                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg mt-1"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    className="w-full p-2 border rounded-lg mt-1"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-200 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <p>
                  <strong>Name:</strong> {selectedUser?.name}
                </p>

                <p>
                  <strong>Email:</strong> {selectedUser?.email}
                </p>

                <p>
                  <strong>Role:</strong> {selectedUser?.role}
                </p>

                <p>
                  <strong>Teacher ID:</strong>{" "}
                  {selectedUser?.teacher_id || "N/A"}
                </p>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full mt-4 bg-gray-800 text-white py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TeacherDashboard;