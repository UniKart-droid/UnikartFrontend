import React, { useState, useEffect } from "react";
import {
  FiMapPin,
  FiClock,
  FiExternalLink,
  FiSearch,
  FiTrash2,
  FiEdit,
  FiX,
  FiDollarSign,
  FiBriefcase
} from "react-icons/fi";

const CareerInternship = ({
  isAdmin = false,
  onDelete,
  onEdit
}) => {

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  // State for Modal
  const [selectedOpp, setSelectedOpp] = useState(null);

  // DEPLOYED BACKEND URL
  const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://unikartweb-production.up.railway.app";

  useEffect(() => {

    document.documentElement.style.backgroundColor = "#ffffff";
    document.body.style.backgroundColor = "#ffffff";

    const metaTheme = document.querySelector(
      'meta[name="theme-color"]'
    );

    if (metaTheme) {
      metaTheme.setAttribute("content", "#ffffff");
    }

    const fetchOpps = async () => {

      try {

        setLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/api/opportunities`
        );

        const data = await response.json();

        setOpportunities(data);

      } catch (error) {

        console.error("Database fetch error:", error);

      } finally {

        setLoading(false);
      }
    };

    fetchOpps();

  }, [API_BASE_URL]);

  const filteredOpps = opportunities.filter((opp) => {

    const matchesSearch =
      (opp.title?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (opp.company?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );

    const matchesFilter =
      filter === "All" || opp.type === filter;

    return matchesSearch && matchesFilter;
  });

  return (

    <div
      className={`min-h-screen bg-white pb-12 transition-colors duration-300 ${
        !isAdmin
          ? "pt-32 px-6 md:px-12 lg:px-24"
          : "p-0"
      }`}
    >

      {!isAdmin && (

        <div className="max-w-7xl mx-auto mb-10 text-center">

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Careers <span className="text-orange-500">
              & Opportunities
            </span>
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Click on any card to view full details and requirements.
          </p>

        </div>
      )}

      {/* Search + Filter */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row gap-4">

        <div className="relative flex-1">

          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Search by role or company..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>

        <div className="flex gap-2">

          {["All", "Internship", "Training"].map(
            (category) => (

              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  filter === category
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                    : "bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            )
          )}
        </div>
      </div>

      {/* Grid View */}
      {loading ? (

        <div className="flex justify-center py-20 bg-white">

          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto bg-white">

          {filteredOpps.map((opp) => (

            <div
              key={opp._id}
              onClick={() => setSelectedOpp(opp)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col cursor-pointer group"
            >

              <div className="flex justify-between items-start mb-4">

                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    opp.type === "Training"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {opp.type}
                </div>

                {isAdmin && (

                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >

                    <button
                      onClick={() => onEdit(opp)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                    >
                      <FiEdit />
                    </button>

                    <button
                      onClick={() => onDelete(opp._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <FiTrash2 />
                    </button>

                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-orange-500 transition-colors">
                {opp.title}
              </h3>

              <p className="text-orange-600 font-medium mb-4">
                {opp.company}
              </p>

              <div className="space-y-2 mb-4 text-sm text-gray-500">

                <div className="flex items-center">
                  <FiMapPin className="mr-2" />
                  {opp.location}
                </div>

                <div className="flex items-center">
                  <FiClock className="mr-2" />
                  {opp.duration}
                </div>

              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2 italic">
                Click to read more...
              </p>

              <div className="mt-auto font-bold text-gray-700">
                {opp.stipend}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* FULL DETAIL MODAL */}
      {selectedOpp && (

        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">

          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in duration-300">

            {/* Header */}
            <div className="h-32 bg-linear-to-r from-orange-400 to-orange-600 p-8 flex justify-between items-start">

              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">

                <FiBriefcase className="text-white text-3xl" />

              </div>

              <button
                onClick={() => setSelectedOpp(null)}
                className="bg-white/20 hover:bg-white/40 p-2 rounded-full text-white transition-colors"
              >
                <FiX size={24} />
              </button>

            </div>

            {/* Content */}
            <div className="p-8 -mt-10 bg-white">

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-50">

                <div className="flex flex-wrap gap-2 mb-4">

                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {selectedOpp.type}
                  </span>

                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {selectedOpp.location}
                  </span>

                </div>

                <h2 className="text-3xl font-black text-gray-900 leading-tight">
                  {selectedOpp.title}
                </h2>

                <p className="text-xl text-orange-600 font-semibold mt-1">
                  {selectedOpp.company}
                </p>

              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">

                  <FiClock
                    className="text-orange-500"
                    size={20}
                  />

                  <div>

                    <p className="text-xs text-gray-400 uppercase font-bold">
                      Duration
                    </p>

                    <p className="text-sm font-bold text-gray-700">
                      {selectedOpp.duration}
                    </p>

                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">

                  <FiDollarSign
                    className="text-orange-500"
                    size={20}
                  />

                  <div>

                    <p className="text-xs text-gray-400 uppercase font-bold">
                      Stipend/Fee
                    </p>

                    <p className="text-sm font-bold text-gray-700">
                      {selectedOpp.stipend}
                    </p>

                  </div>
                </div>
              </div>

              <div className="mt-8">

                <h4 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-orange-500 pl-3">
                  Job Description
                </h4>

                <div className="text-gray-600 leading-relaxed max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {selectedOpp.description}
                </div>

              </div>

              <div className="mt-10 flex gap-4">

                <button
                  onClick={() => setSelectedOpp(null)}
                  className="flex-1 py-4 border-2 border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                >
                  Go Back
                </button>

                <a
                  href={selectedOpp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-2 py-4 bg-gray-900 text-white text-center rounded-2xl font-bold hover:bg-orange-500 shadow-xl shadow-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  Apply Officially
                  <FiExternalLink />
                </a>

              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #ffffff;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f97316;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default CareerInternship;