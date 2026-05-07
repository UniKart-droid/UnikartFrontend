
import React from "react";
import { Link } from "react-router-dom";
// import MarketPlace from './Student/MarketPlace';
const Footer = () => {
  return (
    <div className="mt-5">
      <footer className="footer sm:footer-horizontal bg-[#0f0f0f] text-white p-10 ">
        
        {/* STUDENT LINKS */}
        <nav>
          <h6 className="footer-title text-lg font-bold mb-3">Student</h6>
          <Link to="/MarketPlace" className="link link-hover">Marketplace</Link>
          <Link to="/student/view-notes" className="link link-hover">View Notes</Link>
          <Link to="/student/view-notice" className="link link-hover">View Notices</Link>
          <Link to="/career-internship" className="link link-hover">Internships and Training</Link>
        </nav>

        {/* TEACHER LINKS */}
        <nav>
          <h6 className="footer-title text-lg font-bold mb-3">Teacher</h6>
          <Link to="/teacher/upload-notes" className="link link-hover">Upload Notes</Link>
          <Link to="/teacher/view-notes" className="link link-hover">View Notes</Link>
        </nav>

        {/* COMPANY / GENERAL LINKS */}
        <nav>
          <h6 className="footer-title text-lg font-bold mb-3">Company</h6>
          <Link to="/" className="link link-hover">Home</Link>
          <Link to="/about" className="link link-hover">About Us</Link>
          <Link to="/contact" className="link link-hover">Contact</Link>
        </nav>

        
      </footer>

      <div className="text-center text-gray-400 mt-4">
        &copy; {new Date().getFullYear()} UniKart. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;