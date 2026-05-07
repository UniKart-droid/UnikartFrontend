import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FiMessageSquare, FiMenu, FiX, FiChevronDown, 
  FiUpload, FiEye, FiShoppingCart, FiBook, FiEdit, 
  FiUser, FiUsers, FiBriefcase 
} from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [studentDropdown, setStudentDropdown] = useState(false);
  const [teacherDropdown, setTeacherDropdown] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("token"));

  const teacherLinks = [
    { name: "Upload Notes", path: "/teacher/upload-notes", icon: <FiUpload /> },
    { name: "View Notes", path: "/teacher/view-notes", icon: <FiEye /> },
    { name: "View Marketplace", path: "/teacher/view-marketplace", icon: <FiShoppingCart /> },
    { name: "View Notices", path: "/teacher/view-notices", icon: <FiBook /> },
    { name: "Update Notes", path: "/teacher/update-notes", icon: <FiEdit /> },
  ];

  const adminLinks = [
    { name: "Upload Notice", path: "/admin/upload-notice", icon: <FiUpload /> },
    { name: "View Notice", path: "/admin/view-notice", icon: <FiEye /> },
    { name: "Update Notice", path: "/admin/update-notice", icon: <FiEdit /> },
    { name: "View Marketplace", path: "/admin/view-marketplace", icon: <FiShoppingCart /> },
    { name: "View Notes", path: "/admin/view-notes", icon: <FiBook /> },
    { name: "Training & Internship", path: "/admin/manage-opportunities", icon: <FiBriefcase /> },
    { name: "Student Dashboard", path: "/admin/student-dashboard", icon: <FiUser /> },
    { name: "Teacher Dashboard", path: "/admin/teacher-dashboard", icon: <FiUsers /> },
  ];

  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", syncToken);
    window.addEventListener("tokenChange", syncToken);
    return () => {
      window.removeEventListener("storage", syncToken);
      window.removeEventListener("tokenChange", syncToken);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setStudentDropdown(false);
    setTeacherDropdown(false);
    setAdminDropdown(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setToken(null);
    window.dispatchEvent(new Event("tokenChange"));
    navigate("/Login");
  };

  const routes = {
    home: "/",
    marketplace: "/MarketPlace",
    viewNotesStudent: "/student/view-notes",
    viewNoticesStudent: "/student/view-notice",
    sellItems: "/student/sell-items",
    careerInternship: "/career-internship",
    teacher: "/teacher",
    admin: "/admin",
    login: "/Login",
    messages: "/messages",
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-100 h-20 flex items-center justify-between px-6 min-[917px]:px-12 xl:px-24 transition-all duration-500 ${
          scrolled || isOpen ? "bg-white shadow-lg py-2" : "bg-white min-[917px]:bg-transparent py-4"
        }`}
      >
        <Link to="/" className="text-3xl font-extrabold z-110 transition-colors duration-300 text-black">
          UniKart
        </Link>

        {/* --- DESKTOP NAV --- */}
        <div className="hidden min-[917px]:flex items-center justify-between w-full max-w-5xl ml-8">
          <div className="flex gap-8 lg:gap-12 text-lg font-medium items-center transition-colors duration-300 text-black">
            <Link to={routes.home} className="hover:text-orange-500 transition-colors">Home</Link>
            
            <div className="relative group">
              <div className="flex items-center cursor-pointer hover:text-orange-500 transition-colors">
                Student <FiChevronDown className="ml-1" />
              </div>
              <div className="absolute top-full left-0 mt-2 w-52 bg-white shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-black border border-gray-100">
                <Link to={routes.marketplace} className="block px-5 py-3 hover:bg-gray-100">Marketplace</Link>
                <Link to={routes.viewNotesStudent} className="block px-5 py-3 hover:bg-gray-100">View Notes</Link>
                <Link to={routes.viewNoticesStudent} className="block px-5 py-3 hover:bg-gray-100">View Notice</Link>
                <Link to={routes.sellItems} className="block px-5 py-3 hover:bg-gray-100">Sell Items</Link>
                <Link to={routes.careerInternship} className="block px-5 py-3 hover:bg-gray-100 text-black font-semibold">Training / Internship</Link>
              </div>
            </div>

            <Link to={routes.teacher} className="hover:text-orange-500 transition-colors">Teacher</Link>
            <Link to={routes.admin} className="hover:text-orange-500 transition-colors">Admin</Link>
            
            {token && (
              <Link to={routes.messages} className="text-black hover:text-orange-500 transition-all flex items-center">
                <FiMessageSquare size={24} title="Messages" />
              </Link>
            )}
          </div>

          <div className="flex items-center gap-6">
            {token ? (
              <button onClick={handleLogout} className="px-8 py-2.5 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-all">Logout</button>
            ) : (
              <Link to={routes.login} className="px-8 py-2.5 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-all">Login</Link>
            )}
          </div>
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <div className="min-[917px]:hidden flex items-center gap-5 z-110">
          {token && (
            <Link to={routes.messages} className="text-black">
              <FiMessageSquare size={24} />
            </Link>
          )}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-black text-3xl focus:outline-none bg-transparent border-none p-0"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* --- MOBILE MENU PANEL --- */}
      <div
        className={`fixed inset-0 bg-white z-90 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        } min-[917px]:hidden flex flex-col pt-24 px-6 pb-10 shadow-2xl overflow-y-auto`}
      >
        <div className="flex flex-col gap-2">
          <Link to={routes.home} className="text-xl font-bold py-4 border-b text-gray-800">Home</Link>
          
          {/* Student Dropdown - Mobile */}
          <div className="border-b">
            <button 
              onClick={() => setStudentDropdown(!studentDropdown)}
              className="w-full text-xl font-bold py-4 flex justify-between items-center text-gray-800 focus:outline-none"
            >
              Student <FiChevronDown className={`transition-transform duration-300 ${studentDropdown ? 'rotate-180' : ''}`} />
            </button>
            <div className={`flex flex-col bg-gray-50 transition-all duration-300 ease-in-out overflow-hidden ${
              studentDropdown ? 'max-h-125 opacity-100 mb-4' : 'max-h-0 opacity-0'
            }`}>
              <Link to={routes.marketplace} className="p-3 pl-6 text-lg text-gray-600 border-b border-gray-200">Marketplace</Link>
              <Link to={routes.viewNotesStudent} className="p-3 pl-6 text-lg text-gray-600 border-b border-gray-200">View Notes</Link>
              <Link to={routes.viewNoticesStudent} className="p-3 pl-6 text-lg text-gray-600 border-b border-gray-200">View Notice</Link>
              <Link to={routes.sellItems} className="p-3 pl-6 text-lg text-gray-600 border-b border-gray-200">Sell Items</Link>
              <Link to={routes.careerInternship} className="p-3 pl-6 text-lg font-bold text-black flex items-center gap-2">
                <FiBriefcase className="text-gray-700" /> Training / Internship
              </Link>
            </div>
          </div>

          {/* Teacher Dropdown - Mobile */}
          <div className="border-b">
            <button 
              onClick={() => setTeacherDropdown(!teacherDropdown)}
              className="w-full text-xl font-bold py-4 flex justify-between items-center text-gray-800 focus:outline-none"
            >
              Teacher <FiChevronDown className={`transition-transform duration-300 ${teacherDropdown ? 'rotate-180' : ''}`} />
            </button>
            <div className={`flex flex-col bg-orange-50/50 transition-all duration-300 ease-in-out overflow-hidden ${
              teacherDropdown ? 'max-h-125 opacity-100 mb-4' : 'max-h-0 opacity-0'
            }`}>
              {teacherLinks.map((link, index) => (
                <Link key={index} to={link.path} className="flex items-center gap-3 p-3 pl-6 text-lg text-gray-600 border-b border-gray-200">
                  <span className="text-orange-500">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Admin Dropdown - Mobile */}
          <div className="border-b">
            <button 
              onClick={() => setAdminDropdown(!adminDropdown)}
              className="w-full text-xl font-bold py-4 flex justify-between items-center text-gray-800 focus:outline-none"
            >
              Admin <FiChevronDown className={`transition-transform duration-300 ${adminDropdown ? 'rotate-180' : ''}`} />
            </button>
            <div className={`flex flex-col bg-red-50/30 transition-all duration-300 ease-in-out overflow-hidden ${
              adminDropdown ? 'max-h-200 opacity-100 mb-4' : 'max-h-0 opacity-0'
            }`}>
              {adminLinks.map((link, index) => (
                <Link key={index} to={link.path} className="flex items-center gap-3 p-3 pl-6 text-lg text-gray-600 border-b border-gray-200 last:border-none">
                  <span className="text-red-500">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8">
            {token ? (
              <button onClick={handleLogout} className="w-full py-4 bg-red-500 text-white rounded-xl font-bold text-lg shadow-md">Logout</button>
            ) : (
              <Link to={routes.login} className="block w-full py-4 bg-orange-500 text-white text-center rounded-xl font-bold text-lg shadow-md">Login</Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;