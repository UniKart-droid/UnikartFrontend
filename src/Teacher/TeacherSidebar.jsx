import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiUpload,
  FiEye,
  FiShoppingCart,
  FiBook,
  FiEdit,
  FiMenu,
  FiX
} from "react-icons/fi";

const TeacherSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const teacherLinks = [
    { name: "Upload Notes", path: "/teacher/upload-notes", icon: <FiUpload /> },
    { name: "View Notes", path: "/teacher/view-notes", icon: <FiEye /> },
    { name: "View Marketplace", path: "/teacher/view-marketplace", icon: <FiShoppingCart /> },
    { name: "View Notices", path: "/teacher/view-notices", icon: <FiBook /> },
    { name: "Update Notes", path: "/teacher/update-notes", icon: <FiEdit /> },
  ];

  return (
    <>
      {/* Mobile Toggle  */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-orange-500 text-white rounded-xl shadow-lg hover:bg-orange-600 transition-colors"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`fixed md:static top-0 left-0 h-full md:h-auto w-72 md:w-64 bg-white text-gray-800 shadow-xl md:shadow-none flex flex-col transition-transform duration-300 ease-in-out z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-6 text-xl font-bold border-b border-gray-100 flex items-center gap-2 mt-4 md:mt-0">
          <div className="w-2 h-8 bg-orange-500 rounded-full md:hidden"></div>
          Teacher Panel
        </div>

        <nav className="flex-1 mt-6 px-4 overflow-y-auto">
          {teacherLinks.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-xl mb-2 transition-all duration-200
                ${
                  isActive
                    ? "bg-orange-50 text-orange-600 font-bold shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm md:text-base font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 font-medium">ADMINISTRATION CONSOLE</p>
          <p className="text-[10px] text-gray-300 mt-1">© 2026 Dashboard v2.0</p>
        </div>
      </div>
    </>
  );
};

export default TeacherSidebar;