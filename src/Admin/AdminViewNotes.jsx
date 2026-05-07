import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import Footer from "../component/Footer";

const AdminViewNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `${import.meta.env.VITE_API_URL}/api/notes`;

  // Fetch Notes Function
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token"); 
    try {
      const res = await axios.get(`${API_URL}/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data.notes || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token"); 
    
    if (!token) {
      alert("Your session has expired. Please login again.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const res = await axios.delete(`${API_URL}/delete/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
        });

        if (res.status === 200) {
          
          setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
          alert("Note deleted successfully! 🗑️");
        }
      } catch (error) {
        console.error("Delete error:", error.response);
        const errorMsg = error.response?.data?.message || "You are not authorized to delete this note.";
        alert(errorMsg);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex flex-1">
        <AdminSidebar />
        
        
        <div className="flex-1 mt-28 px-6 py-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Manage Notes</h2>
            {loading && (
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {!loading && notes.map((note) => (
              <div key={note._id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow flex flex-col justify-between border border-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 truncate mb-1">{note.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 italic">Subject: {note.subject}</p>
                  
                  <div className="bg-orange-50 p-3 rounded-lg mb-4">
                    <p className="text-xs text-gray-600 font-medium">
                      Uploaded by: <span className="text-orange-700 font-bold">{note.teacherId?.name || "System Admin"}</span>
                    </p>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {note.description || "No description provided."}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-4">
                    <span className="text-xs text-gray-400 truncate max-w-30">
                      📄 {note.file ? note.file.split('/').pop() : "document.pdf"}
                    </span>

                    <a
                      href={`${import.meta.env.VITE_API_URL}/${note.file}`}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="text-orange-600 text-xs font-bold hover:text-orange-800 transition-colors"
                    >
                      Download
                    </a>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => window.open(`${import.meta.env.VITE_API_URL}/${note.file}`, "_blank")}
                      className="flex-1 bg-gray-800 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-black transition active:scale-95"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleDelete(note._id)}
                      className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 transition active:scale-95"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!loading && notes.length === 0 && (
            <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
              <p className="text-gray-400 text-xl font-medium">No notes found in the database.</p>
              <p className="text-gray-400 text-sm mt-2">Check back later or upload new materials.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminViewNotes;