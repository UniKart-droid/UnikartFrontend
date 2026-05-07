import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import Footer from "../component/Footer";
import axios from "axios";

const StudentDashboard = () => {
  const [students, setStudents] = useState([]);

  // MODAL STATES
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // ✅ UPDATED API BASE URL
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://unikartweb.onrender.com";

  // Fetch approved students
  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/user/approved-students`
      );

      setStudents(
        Array.isArray(res.data.students) ? res.data.students : []
      );
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure to delete this student?"
    );

    if (confirmDelete) {
      try {
        await axios.patch(
          `${API_BASE_URL}/api/user/reject-user/${id}`
        );

        setStudents(
          students.filter((student) => student._id !== id)
        );
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  // Handle View Button
  const handleView = async (id) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/user/user/${id}`
      );

      setSelectedUser(res.data.user);
      setIsEditMode(false);
      setIsModalOpen(true);
    } catch (error) {
      alert("Error fetching student details");
    }
  };

  // Handle Edit Click
  const handleEditClick = (student) => {
    setSelectedUser(student);

    setFormData({
      name: student.name,
      email: student.email,
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

      alert("Student updated successfully!");

      setIsModalOpen(false);

      fetchStudents();
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
            Student Dashboard
          </h2>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white rounded-3xl shadow-lg overflow-x-auto border border-gray-100">
            <table className="w-full text-left min-w-full">
              <thead className="bg-gray-50 text-gray-700 text-sm uppercase tracking-wide">
                <tr>
                  <th className="p-5">Name</th>
                  <th className="p-5">Email</th>
                  <th className="p-5">ID Card</th>
                  <th className="p-5 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr
                    key={student._id}
                    className="border-t hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-5 font-semibold text-gray-800">
                      {student.name}
                    </td>

                    <td className="p-5 text-gray-600">
                      {student.email}
                    </td>

                    <td className="p-5">
                      {student.id_card ? (
                        <button
                          onClick={() =>
                            setSelectedCard(student.id_card)
                          }
                          className="px-4 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                          View ID Card
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No ID Card
                        </span>
                      )}
                    </td>

                    <td className="p-5 flex justify-center gap-3">
                      <button
                        onClick={() => handleView(student._id)}
                        className="px-4 py-1.5 text-sm bg-orange-500 text-white rounded-lg"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleEditClick(student)}
                        className="px-4 py-1.5 text-sm border border-blue-400 text-blue-500 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(student._id)}
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
            {students.map((student) => (
              <div
                key={student._id}
                className="bg-white p-4 rounded-xl shadow-md border border-gray-100"
              >
                <h3 className="font-semibold text-lg text-gray-800">
                  {student.name}
                </h3>

                <p className="text-gray-600 text-sm">
                  {student.email}
                </p>

                <div className="mt-2">
                  {student.id_card && (
                    <button
                      onClick={() =>
                        setSelectedCard(student.id_card)
                      }
                      className="px-3 py-1 text-sm bg-purple-600 text-white rounded"
                    >
                      View ID Card
                    </button>
                  )}
                </div>

                <div className="flex gap-2 mt-3 flex-wrap">
                  <button
                    onClick={() => handleView(student._id)}
                    className="px-3 py-1 text-sm bg-orange-500 text-white rounded"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleEditClick(student)}
                    className="px-3 py-1 text-sm border border-blue-400 text-blue-500 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(student._id)}
                    className="px-3 py-1 text-sm border border-red-400 text-red-500 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ID CARD PREVIEW MODAL */}
          {selectedCard && (
            <div
              className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedCard(null)}
            >
              <div
                className="bg-white p-4 rounded-3xl shadow-2xl max-w-2xl w-[90%]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={`${API_BASE_URL}/${selectedCard.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt="ID Card"
                  className="w-full max-h-[70vh] object-contain rounded-xl"
                />

                <button
                  onClick={() => setSelectedCard(null)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl w-full font-semibold"
                >
                  Close Preview
                </button>
              </div>
            </div>
          )}

          {/* VIEW / EDIT MODAL */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold mb-4">
                  {isEditMode
                    ? "Edit Student"
                    : "Student Details"}
                </h3>

                {isEditMode ? (
                  <form
                    onSubmit={handleUpdate}
                    className="space-y-4"
                  >
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
                        Save
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
                      <strong>Name:</strong>{" "}
                      {selectedUser?.name}
                    </p>

                    <p>
                      <strong>Email:</strong>{" "}
                      {selectedUser?.email}
                    </p>

                    <p>
                      <strong>Role:</strong>{" "}
                      {selectedUser?.role}
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

          {students.length === 0 && (
            <p className="text-gray-500 mt-6 text-center">
              No approved students available.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudentDashboard;