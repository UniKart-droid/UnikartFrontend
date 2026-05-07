import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./component/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import MarketPlace from "./Student/MarketPlace";
import ViewNotes from "./Student/ViewNotes";
import ViewNotices from "./Student/ViewNotice";
import UploadNotes from "./Teacher/UplodeNotes";
import TeacherTab from "./Teacher/TeacherTab";
import TeacherViewNotes from "./Teacher/TeacherViewNotes";
import TeacherMarketPlace from "./Teacher/TeacherMarketPlace";
import TeacherViewNotice from "./Teacher/TeacherViewNotice";
import UpdateNotes from "./Teacher/UpdateNotes";
import AdminTab from "./Admin/AdminTab";
import UploadNotice from "./Admin/UploadNotice";
import AdminViewNotice from "./Admin/AdminViewNotice";
import AdminUpdateNotice from "./Admin/AdminUpdateNotice";
import AdminMarketPlace from "./Admin/AdminMarketPlace";
import AdminViewNotes from "./Admin/AdminViewNotes";
import StudentDashboard from "./Admin/StudentDashboard";
import TeacherDashboard from "./Admin/TeacherDashboard";
import WhyChoose from "./component/WhyChoose";
import StartNow from "./component/StartNow";
import SellItems from "./Student/SellItems";
import AboutUs from "./component/Aboutus";
import Contact from "./component/Contact";
import PrivacyPolicy from "./component/PrivacyPolicy";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SellerProfile from "./pages/SellerProfile";
import Chat from "./pages/Chat";

import { UIProvider } from "./context/UIContext";
import ChatList from "./pages/ChatList";

// Import Protected Routes
import AdminRoute from './component/AdminRoute';
import TeacherRoute from './component/TeacherRoute'; 
import CareerInternship from "./Admin/CareerInternship";
import ManageOpportunities from "./Admin/ManageOpportunities";

const AnimatedRoutes = () => {
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //  Auth Sync Logic
  const syncUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      setCurrentUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    syncUser();
    window.addEventListener("tokenChange", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("tokenChange", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public & Common Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/MarketPlace" element={<MarketPlace />} />
        <Route path="/student/view-notes" element={<ViewNotes />} />
        <Route path="/student/view-notice" element={<ViewNotices />} />
        <Route path="/career-internship" element={<CareerInternship />} />

        {/*  Teacher Protected Routes */}
        <Route element={<TeacherRoute user={currentUser} isLoading={loading} />}>
          <Route path="/teacher" element={<TeacherTab />} />
          <Route path="/teacher/view-notes" element={<TeacherViewNotes />} />
          <Route path="/teacher/view-marketplace" element={<TeacherMarketPlace />} />
          <Route path="/teacher/view-notices" element={<TeacherViewNotice />} />
          <Route path="/teacher/upload-notes" element={<UploadNotes />} />
          <Route path="/teacher/update-notes" element={<UpdateNotes />} />
        </Route>

        {/*  Admin Protected Routes */}
        <Route element={<AdminRoute user={currentUser} isLoading={loading} />}>
          <Route path="/admin" element={<AdminTab />} />
          <Route path="/admin/upload-notice" element={<UploadNotice />} />
          <Route path="/admin/update-notice" element={<AdminUpdateNotice />} />
          <Route path="/admin/view-marketplace" element={<AdminMarketPlace />} />
          <Route path="/admin/view-notes" element={<AdminViewNotes />} />
          <Route path="/admin/student-dashboard" element={<StudentDashboard />} />
          <Route path="/admin/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/admin/view-notice" element={<AdminViewNotice />} />
          
          {/*  Corrected Path for Manage Opportunities */}
          <Route path="/admin/manage-opportunities" element={<ManageOpportunities />} />
        </Route>

        {/* Other Routes */}
        <Route path="whychoose" element={<WhyChoose />} />
        <Route path="startnow" element={<StartNow />} />
        <Route path="/student/sell-items" element={<SellItems />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/seller/:id" element={<SellerProfile />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/messages" element={<ChatList />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <UIProvider>
      <BrowserRouter>
        <Navbar />
        <AnimatedRoutes />
      </BrowserRouter>
    </UIProvider>
  );
};

export default App;