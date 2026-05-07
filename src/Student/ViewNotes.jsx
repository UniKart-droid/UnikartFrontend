import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const ViewNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("All");

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes/all`);
      if (res.data.success) {
        setNotes(res.data.notes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    document.body.style.backgroundColor = "#fcfcfd";
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter((note) => {
    const matchSearch =
      (note.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (note.subject?.toLowerCase() || "").includes(search.toLowerCase());
    const matchSemester = semester === "All" || note.semester.toString() === semester;
    return matchSearch && matchSemester;
  });


  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#fcfcfd] z-50">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center font-black text-slate-400 tracking-[0.2em] uppercase text-sm animate-pulse"
        >
          Initialising CSE Resources...
        </motion.div>
      </div>
    );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
  
      className="min-h-screen p-6 md:p-10 pt-32 md:pt-40 bg-[#fcfcfd] font-sans scroll-mt-20"
    >

      <div className="mb-14 text-center">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-3"
        >
          The Ultimate Stack for{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-orange-700">
            Engineering Success.
          </span>
        </motion.h1>
        <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em] ml-1">
          Study Smarter <span className="text-orange-500 mx-2">•</span> Build Faster
        </p>
      </div>

      {/*  Filter Bar */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 mb-10"
      >
        <input
          type="text"
          placeholder="Search topics, subjects, or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none shadow-sm transition-all bg-white font-medium text-slate-600"
        />

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-orange-500/10 bg-white shadow-sm font-bold text-slate-700 outline-none cursor-pointer"
        >
          <option value="All">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <option key={s} value={s.toString()}>{s}th Semester</option>
          ))}
        </select>
      </motion.div>

      {/*  Notes Grid */}
      <div className="max-w-7xl mx-auto">
        <motion.div 
          layout 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note, index) => (
                <motion.div
                  key={note._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-7 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group flex flex-col"
                >
                  {/* Card Visual Header */}
                  <div className="h-44 bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white p-5 relative overflow-hidden transition-all duration-500 group-hover:bg-orange-600 shadow-inner">
                    <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] border border-white/20">
                      Sem {note.semester}
                    </div>
                    <div className="absolute -bottom-4 -left-4 text-7xl opacity-5 group-hover:opacity-10 transition-opacity">📚</div>
                    <h2 className="text-2xl font-black text-center leading-[1.1] tracking-tighter uppercase px-2">
                      {note.subject}
                    </h2>
                  </div>

                  <div className="mt-7 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors tracking-tight mb-3">
                      {note.title}
                    </h3>

                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6 font-medium opacity-80 italic">
                      "{note.description}"
                    </p>

                    <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-end">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Contributor</span>
                          <span className="text-sm font-extrabold text-slate-700 tracking-tight">
                            {note.teacherId?.name || "Faculty Member"}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1.5">
                          <span className="text-orange-500 opacity-70">🕒</span>
                          {new Date(note.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={`${import.meta.env.VITE_API_URL}/${note.file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-7 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200"
                      >
                        Open Resource
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="col-span-full text-center py-24"
              >
                <div className="text-5xl mb-4 grayscale opacity-30 animate-bounce">🔍</div>
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
                   No Resources Found
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ViewNotes;