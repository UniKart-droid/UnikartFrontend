import React, { useEffect, useState } from 'react';
import AdminViewNotice from './AdminViewNotice';
import AdminSidebar from './AdminSidebar';
import axios from "axios";

const API = "https://unikartweb-production.up.railway.app";

const AdminTab = () => {
  const [users, setUsers] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/user/pending-users`);
      setUsers(Array.isArray(res.data?.users) ? res.data.users : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.patch(`${API}/api/user/approve-user/${id}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`${API}/api/user/reject-user/${id}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar - Mobile handles internally or hidden via CSS */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 mt-20 md:mt-24 px-4 md:px-8 py-6 w-full overflow-x-hidden">

        <h2 className="text-2xl md:text-4xl font-extrabold mb-6 md:mb-8 text-gray-800 text-center md:text-left">
          Pending User Requests
        </h2>

        {users.length === 0 ? (
          <div className="flex justify-center md:justify-start">
            <p className="text-gray-500 text-lg italic">No pending requests</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="p-4 md:p-6 bg-white border rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-md transition-shadow gap-4"
              >
                <div className="w-full sm:w-auto">
                  <p className="font-bold text-lg text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600 break-all">{user.email}</p>
                  <p className="text-xs font-medium text-blue-600 mt-1 uppercase tracking-wider">
                    Role: {user.role}
                  </p>

                  {/* ID Card Thumbnail */}
                  {user.role === "student" && user.id_card && (
                    <div className="mt-3">
                      <p className="text-[10px] text-gray-400 mb-1 font-semibold uppercase">
                        ID Card Preview:
                      </p>

                      <img
                        src={`${API}/${user.id_card.replace(/\\/g, "/")}`}
                        alt="Student ID Card"
                        className="w-32 h-20 md:w-40 md:h-24 object-cover border-2 border-gray-200 rounded-lg shadow-sm cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setSelectedImage(user.id_card)}
                      />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row sm:flex-col lg:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleApprove(user._id)}
                    className="flex-1 sm:w-32 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm shadow-sm"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(user._id)}
                    className="flex-1 sm:w-32 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm shadow-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- IMAGE MODAL --- */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

            {/* Modal Content */}
            <div
              className="relative bg-white rounded-2xl shadow-2xl p-2 md:p-3 max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-4 -right-4 bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-2xl border border-gray-200 hover:bg-gray-100 font-bold z-110"
              >
                ✕
              </button>

              <div className="overflow-hidden rounded-xl">
                <img
                  src={`${API}/${selectedImage.replace(/\\/g, "/")}`}
                  alt="ID Card Preview"
                  className="w-full h-auto max-h-[75vh] md:max-h-[85vh] object-contain mx-auto"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTab;