import React from "react";
import { motion } from "framer-motion";
import TeacherSidebar from "./TeacherSidebar";
import Footer from "../component/Footer";
import MarketPlace from '../Student/MarketPlace';

const TeacherMarketPlace = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -15 }} 
      animate={{ opacity: 1, x: 0 }}   
      exit={{ opacity: 0, x: 15 }}     
      transition={{ duration: 0.4 }}    
      
      className="min-h-screen flex flex-col bg-[#f8fafc] pt-20 md:pt-24"
    >
      
      
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        
        
        <aside className="hidden md:block w-64 border-r border-gray-200 bg-white">
          <TeacherSidebar />
        </aside>

        
        <main className="flex-1 overflow-y-auto">
          
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 lg:p-12">
            
            {/* Page Header Section */}
            <div className="mb-6 px-2">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Marketplace</h1>
              <p className="text-slate-500 text-sm md:text-base">Explore and manage available resources.</p>
            </div>

            {/* Content Card  */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 md:p-6 transition-all duration-300 hover:shadow-md">
              <div className="w-full">
                <MarketPlace withLayout={false} hideSidebar={true} hideFooter={true} />
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Modern Minimal Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200">
        <Footer />
      </footer>
    </motion.div>
  );
};

export default TeacherMarketPlace;