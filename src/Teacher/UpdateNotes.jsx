import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Edit3,
  Trash2,
  FileText,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import TeacherSidebar from "./TeacherSidebar";
import Footer from "../component/Footer";

const UpdateNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    subject: "",
    semester: "",
    file: null,
  });

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const API_BASE_URL =
    import.meta.env.VITE_API_URL ;

  const getToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login again.");
      return null;
    }

    return token;
  };

  const fetchNotes = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/notes/all`
      );

      if (data.success) {
        setNotes(data.notes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, file: e.target.files[0] });
  };

  const handleEdit = (note) => {
    setForm({
      id: note._id,
      title: note.title,
      description: note.description,
      subject: note.subject,
      semester: note.semester || "",
      file: null,
    });

    setIsEditing(true);
  };

  const handleDelete = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const token = getToken();

        if (!token) return;

        const { data } = await axios.delete(
          `${API_BASE_URL}/api/notes/delete/${noteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) fetchNotes();
      } catch (error) {
        alert(error.response?.data?.message || "Delete failed");
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if (!form.title || !form.description || !form.subject) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("subject", form.subject);

    if (form.file) {
      formData.append("file", form.file);
    }

    try {
      const token = getToken();

      if (!token) return;

      const { data } = await axios.put(
        `${API_BASE_URL}/api/notes/update/${form.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setIsEditing(false);
        fetchNotes();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <motion.div className="min-h-screen flex flex-col bg-slate-50 pt-12 md:pt-20">
      <div className="flex flex-1">
        <aside className="hidden md:block border-r bg-white">
          <TeacherSidebar />
        </aside>

        <main className="flex-1 p-6">
          <h2 className="text-3xl font-bold mb-6">
            Manage Notes
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {notes.map((note) => {
                const noteTeacherId =
                  note.teacherId?._id || note.teacherId;

                const currentUserId =
                  currentUser?._id ||
                  currentUser?.id ||
                  currentUser?.userId;

                const isOwner =
                  noteTeacherId &&
                  currentUserId &&
                  String(noteTeacherId) ===
                    String(currentUserId);

                const isAdmin =
                  currentUser?.role === "admin";

                const canManage = isOwner || isAdmin;

                return (
                  <div
                    key={note._id}
                    className="bg-white p-4 rounded-xl shadow relative"
                  >
                    {canManage && (
                      <div className="absolute right-2 top-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(note)}
                        >
                          <Edit3 size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(note._id)
                          }
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}

                    <h3 className="font-bold">
                      {note.title}
                    </h3>

                    <p>{note.description}</p>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* FIXED MODAL */}
      <AnimatePresence>
        {isEditing && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96">
              <h3 className="text-xl font-bold mb-4">
                Edit Note
              </h3>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full mb-2 border p-2"
              />

              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full mb-2 border p-2"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full mb-2 border p-2"
              />

              <input
                type="file"
                onChange={handleFileChange}
              />

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-4 py-2"
                >
                  Save
                </button>

                <button
                  onClick={handleCancel}
                  className="bg-gray-300 px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </motion.div>
  );
};

export default UpdateNotes;