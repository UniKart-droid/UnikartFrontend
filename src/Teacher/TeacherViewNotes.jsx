import React from "react";
import ViewNotes from "../Student/ViewNotes";
import TeacherSidebar from "./TeacherSidebar";
import Footer from "../component/Footer";

const TeacherViewNotes = () => {
  return (
    
    <div className="min-h-screen flex flex-col bg-slate-50 pt-12 md:pt-20">
      
      
      <div className="flex flex-1 flex-col md:flex-row gap-0">
        
        {/* Sidebar Section  */}
        <aside className="md:w-64 bg-white shadow-sm z-10">
          <TeacherSidebar />
        </aside>

        {/* Content Container  */}
        <main className="flex-1 flex flex-col">
          <div className="p-4 md:p-8 lg:p-10">
            
            {/* Wrapper for the ViewNotes component to give it a "Card" feel */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-2 md:p-4">
                <ViewNotes withLayout={false} hideNavbar={true} hideFooter={true} />
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Footer - Minimal border top */}
      <footer className="mt-auto border-t border-slate-200">
        <Footer />
      </footer>
    </div>
  );
};

export default TeacherViewNotes;