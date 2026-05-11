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

  const API_BASE_URL = import.meta.env.VITE_API_URL;

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
    <motion.div className="min-h-screen flex flex-col bg-slate-100 pt-12 md:pt-20 text-slate-900">
      <div className="flex flex-1">
        <aside className="hidden md:block border-r border-slate-200 bg-white shadow-sm">
          <TeacherSidebar />
        </aside>

        <main className="flex-1 p-6">
          <h2 className="text-3xl font-extrabold mb-8 text-black tracking-tight">
            Manage Notes
          </h2>

          {loading ? (
            <div className="flex items-center gap-2 text-slate-600">
              <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div>
              <p className="font-medium">Loading notes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {notes.map((note) => {
                const noteTeacherId = note.teacherId?._id || note.teacherId;
                const currentUserId = currentUser?._id || currentUser?.id || currentUser?.userId;
                const isOwner = noteTeacherId && currentUserId && String(noteTeacherId) === String(currentUserId);
                const isAdmin = currentUser?.role === "admin";
                const canManage = isOwner || isAdmin;

                return (
                  <div
                    key={note._id}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative group"
                  >
                    {canManage && (
                      <div className="absolute right-4 top-4 flex gap-3">
                        <button
                          onClick={() => handleEdit(note)}
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit3 size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(note._id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    )}

                    <div className="pr-16">
                      <h3 className="font-bold text-xl text-black mb-2">
                        {note.title}
                      </h3>
                      <span className="inline-block bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded mb-3 uppercase tracking-wider">
                        {note.subject}
                      </span>
                      <p className="text-slate-700 leading-relaxed text-sm">
                        {note.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-6 text-black border-b pb-3">
                Edit Note Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter title"
                    className="w-full border-2 border-slate-100 rounded-lg p-3 focus:border-black outline-none transition-colors text-black font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Enter subject"
                    className="w-full border-2 border-slate-100 rounded-lg p-3 focus:border-black outline-none transition-colors text-black font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border-2 border-slate-100 rounded-lg p-3 focus:border-black outline-none transition-colors text-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-2">Update File (Optional)</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-black transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-black text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-black/20"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </motion.div>
  );
};

export default UpdateNotes;
