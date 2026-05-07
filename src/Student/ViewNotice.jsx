import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const ViewNotices = ({ withLayout = true }) => {
  const [notices, setNotices] = useState([]); 
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Backend API URL
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";

  const API_URL = `${API_BASE_URL}/api/notices`;

  // Fetch data from database
  useEffect(() => {
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

    fetchNotices();
  }, [API_URL]);

  // Search filtering
  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(search.toLowerCase())
  );

  // Helper: Format Date from MongoDB createdAt
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Helper: Format Time from MongoDB createdAt
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen transition-all ${
        withLayout
          ? "pt-28 pb-12 px-6 md:px-12 bg-slate-50"
          : "p-4 bg-transparent"
      }`}
    >
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10">
        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter"
        >
          Campus{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-orange-700">
            Updates
          </span>
        </motion.h1>

        <p className="text-slate-500 mt-2 font-medium italic">
          Stay updated with everything happening around campus.
        </p>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-xl mt-8"
        >
          <div className="relative group">
            <input
              type="text"
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-6 pr-12 py-4 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium text-slate-700"
            />

            <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">
              🔍
            </span>
          </div>
        </motion.div>
      </div>

      {/* Notices Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>

            <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">
              Syncing with database...
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice, index) => (
                  <motion.div
                    key={notice._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                    }}
                    whileHover={{ y: -5 }}
                    className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-full -mr-10 -mt-10 group-hover:bg-orange-500/10 transition-colors" />

                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200">
                        {notice.type || "Notice"}
                      </span>

                      <div className="text-right">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                          {formatDate(notice.createdAt)}
                        </p>

                        <p className="text-[10px] font-bold text-orange-500/70">
                          {formatTime(notice.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-black text-slate-800 leading-tight mb-3 group-hover:text-orange-600 transition-colors">
                        {notice.title}
                      </h3>

                      <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        {notice.description}
                      </p>
                    </div>

                    {/* View PDF Button */}
                    {notice.pdfUrl ? (
                      <motion.a
                        href={`${API_BASE_URL}/uploads/notices/${notice.pdfUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileTap={{ scale: 0.95 }}
                        className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs text-center uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200 block"
                      >
                        View Full Details
                      </motion.a>
                    ) : (
                      <div className="mt-6 w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs text-center uppercase tracking-widest cursor-not-allowed">
                        No Attachment
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-20"
                >
                  <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">
                    No notices found
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ViewNotices;