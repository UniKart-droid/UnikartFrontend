import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import Footer from "../component/Footer";

const AdminViewNotice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = "https://unikartweb-production.up.railway.app";
  const API_URL = `${API}/api/notices`;

  useEffect(() => {

    const fetchNotices = async () => {

      try {

        setLoading(true);

        const response = await axios.get(API_URL);

        setNotices(response.data);

        setLoading(false);

      } catch (err) {

        console.error("Error fetching notices:", err);

        setError("Failed to load notices from database.");

        setLoading(false);
      }
    };

    fetchNotices();

  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <div className="flex flex-1">

        <AdminSidebar />

        <div className="flex-1 mt-24 px-6 py-6">

          <h2 className="text-3xl font-bold text-gray-700 mb-8">
            All Notices (Database)
          </h2>

          {loading && (

            <div className="flex justify-center items-center h-40">

              <p className="text-xl text-orange-500 animate-pulse font-semibold">
                Loading notices...
              </p>

            </div>
          )}

          {error && (

            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!loading && !error && (

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

                  </div>

                  <div className="mt-4 flex justify-between items-center text-sm text-gray-500 border-t pt-3">

                    <span>
                      📅 {new Date(notice.createdAt).toLocaleDateString()}
                    </span>

                    {notice.pdfUrl && (

                      <a
                        href={`${API}/uploads/notices/${notice.pdfUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-600 font-bold transition-colors"
                      >
                        View PDF
                      </a>
                    )}

                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && notices.length === 0 && (

            <p className="text-gray-500 mt-6 text-center italic">
              No notices found in the database.
            </p>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminViewNotice;