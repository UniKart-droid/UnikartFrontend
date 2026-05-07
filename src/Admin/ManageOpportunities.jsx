import React, { useState } from "react";
import CareerInternship from "./CareerInternship";
import {
  FiPlus,
  FiX,
  FiBriefcase,
  FiLayers,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiLink,
  FiAlignLeft,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "./AdminSidebar";

const ManageOpportunities = () => {
  const [showForm, setShowForm] = useState(false);

  // ✅ UPDATED API URL
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://unikartweb.onrender.com";

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    type: "Internship",
    location: "",
    duration: "",
    stipend: "",
    link: "",
    description: "",
  });

  const [refreshKey, setRefreshKey] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/opportunities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Opportunity posted successfully! 🎉");

        setShowForm(false);

        setFormData({
          title: "",
          company: "",
          type: "Internship",
          location: "",
          duration: "",
          stipend: "",
          link: "",
          description: "",
        });

        setRefreshKey((prev) => prev + 1);
      } else {
        alert("Failed to post opportunity.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Connection Refused!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this opportunity?")) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/opportunities/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setRefreshKey((prev) => prev + 1);
        } else {
          alert("Failed to delete opportunity.");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to delete.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 fixed h-full z-40">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-10 pt-28 sm:pt-32 md:pt-48 lg:pt-52 pb-20"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-14 gap-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-left w-full"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-2 md:mb-4 tracking-tight leading-tight">
                Manage <span className="text-orange-500">Careers</span>
              </h1>

              <p className="text-slate-500 text-sm sm:text-base md:text-lg font-medium italic">
                Post new openings or curate existing listings.
              </p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center justify-center gap-3 w-full md:w-auto px-6 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-3xl font-black text-base md:text-lg transition-all shadow-xl shadow-orange-100 shrink-0 ${
                showForm
                  ? "bg-slate-900 text-white"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              {showForm ? (
                <>
                  <FiX size={20} /> Close Form
                </>
              ) : (
                <>
                  <FiPlus size={20} /> New Opportunity
                </>
              )}
            </motion.button>
          </div>

          {/* Animated Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -20 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -20 }}
                className="overflow-hidden mb-8 md:mb-12"
              >
                <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl md:rounded-4xl shadow-2xl border border-slate-100 relative">
                  <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 text-orange-600 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                      <FiBriefcase size={20} />
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-slate-800">
                      Opportunity Details
                    </h3>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                  >
                    <div className="relative">
                      <FiBriefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Job Title"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="relative">
                      <FiLayers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                      <input
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Company"
                        className="form-input"
                        required
                      />
                    </div>

                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="form-input pl-5 bg-slate-50 cursor-pointer appearance-none"
                    >
                      <option value="Internship">Internship</option>
                      <option value="Training">Training</option>
                    </select>

                    <div className="relative">
                      <FiMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                      <input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Location"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="relative">
                      <FiClock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                      <input
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Duration"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="relative">
                      <FiDollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                      <input
                        name="stipend"
                        value={formData.stipend}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Stipend"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="relative lg:col-span-1">
                      <FiLink className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                      <input
                        name="link"
                        value={formData.link}
                        onChange={handleInputChange}
                        type="url"
                        placeholder="Apply URL"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="relative lg:col-span-2">
                      <FiAlignLeft className="absolute left-5 top-6 text-slate-400" />

                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Brief Description..."
                        className="form-input h-24 md:h-20 pt-5"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="bg-slate-900 text-white font-black text-lg md:text-xl rounded-2xl py-4 md:py-5 hover:bg-orange-500 transition-all lg:col-span-3 shadow-xl shadow-slate-200 mt-2"
                    >
                      Publish Now
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Listings */}
          <div className="bg-white rounded-3xl md:rounded-4xl p-4 sm:p-6 md:p-8 border border-slate-200 shadow-sm overflow-hidden">
            <div className="mb-6 md:mb-8 px-2 md:px-6">
              <h4 className="text-slate-400 font-black uppercase tracking-widest text-[10px] md:text-xs">
                Live Listings
              </h4>
            </div>

            <div className="overflow-x-auto">
              <CareerInternship
                key={refreshKey}
                isAdmin={true}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>

        <style>
          {`
            .form-input {
              width: 100%;
              padding: 14px 14px 14px 52px;
              border-radius: 16px;
              border: 2px solid transparent;
              outline: none;
              transition: all 0.3s;
              background-color: #f8fafc;
              font-weight: 600;
              color: #1e293b;
              font-size: 14px;
            }

            @media (min-width: 768px) {
              .form-input {
                padding: 16px 16px 16px 52px;
                border-radius: 18px;
                font-size: 15px;
              }
            }

            @media (min-width: 1024px) {
              .form-input {
                padding: 18px 18px 18px 52px;
                border-radius: 20px;
                font-size: 16px;
              }
            }

            .form-input:focus {
              border-color: #f97316;
              background-color: #fff;
              box-shadow: 0 10px 30px -10px rgba(249, 115, 22, 0.2);
            }
          `}
        </style>
      </motion.div>
    </div>
  );
};

export default ManageOpportunities;