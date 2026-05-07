import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiUpload,
  FiEye,
  FiEdit,
  FiShoppingCart,
  FiBook,
  FiUser,
  FiUsers,
  FiBriefcase, 
} from "react-icons/fi";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Upload Notice", path: "/admin/upload-notice", icon: <FiUpload /> },
    { name: "View Notice", path: "/admin/view-notice", icon: <FiEye /> },
    { name: "Update Notice", path: "/admin/update-notice", icon: <FiEdit /> },
    { name: "View Marketplace", path: "/admin/view-marketplace", icon: <FiShoppingCart /> },
    { name: "View Notes", path: "/admin/view-notes", icon: <FiBook /> },
    
    { name: "Training & Internship", path: "/admin/manage-opportunities", icon: <FiBriefcase /> },
    { name: "Student Dashboard", path: "/admin/student-dashboard", icon: <FiUser /> },
    { name: "Teacher Dashboard", path: "/admin/teacher-dashboard", icon: <FiUsers /> },
  ];

  return (
    <>
      {/*  Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold shadow-md"
        >
          ☰
        </button>
      </div>

      {/*  Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/*  Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full md:h-auto w-64 bg-white text-gray-800 shadow-md rounded-2xl flex flex-col transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:mt-28 md:ml-4`}
      >
        {/* Header */}
        <div className="p-6 mt-20  md:mt-4 text-xl font-bold border-b border-gray-200">
          Admin Panel
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 overflow-y-auto">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 rounded-lg mb-1 transition
               ${
                 isActive
                   ? "bg-gray-100 font-semibold text-gray-900"
                   : "hover:bg-orange-200 hover:text-gray-900"
               }`
              }
              onClick={() => setIsOpen(false)} 
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;