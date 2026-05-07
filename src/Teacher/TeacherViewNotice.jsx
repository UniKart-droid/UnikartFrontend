import React from "react";
import ViewNotice from "../Student/ViewNotice";
import TeacherSidebar from "./TeacherSidebar";
import Footer from "../component/Footer";

const TeacherViewNotice = () => {
  return (
    
    <div className="min-h-screen flex flex-col bg-[#fcfcfd] pt-12 md:pt-20">
      
      {/* Layout Wrapper */}
      <div className="flex flex-1 flex-col md:flex-row">
        
        {/* Sidebar with sticky positioning for better UX */}
        <aside className="md:w-72 bg-white border-r border-slate-100 shadow-sm">
          <TeacherSidebar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full px-4 py-8 md:px-10 md:py-16">
          
          {/* Header section for the Notice board feel */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Notice Board
            </h2>
            <div className="h-1 w-20 bg-blue-600 rounded-full mt-2"></div>
          </div>

          {/* Wrapper for the ViewNotice component */}
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-4 md:p-8">
            <ViewNotice withLayout={false} hideNavbar={true} hideFooter={true} />
          </div>
          
        </main>
      </div>

      {/* Footer with a cleaner look */}
      <footer className="bg-white border-t border-slate-100">
        <Footer />
      </footer>
    </div>
  );
};

export default TeacherViewNotice;