import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "./AdminSidebar";

const Marketplace = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null); 
  const [editFormData, setEditFormData] = useState({ 
    title: "", 
    price: "", 
    description: "", 
    category: "" 
  });

  const navigate = useNavigate();
  const API_URL = `${import.meta.env.VITE_API_URL}/api/items`;
  
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");
  const isAdmin = currentUser?.role === "admin";

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/all`);
      setProductsData(res.data.items || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredProducts = productsData.filter((item) => {
    const titleMatch = item.title?.toLowerCase().includes(search.toLowerCase());
    const categoryMatch = 
      category === "All" || 
      item.category?.toLowerCase() === category.toLowerCase();
    return titleMatch && categoryMatch;
  });

  const formatTime = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const handleEditClick = (item) => {
    setSelectedItem(null); 
    setEditFormData(item);
    setImageFile(null);
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const data = new FormData();
      data.append("title", editFormData.title);
      data.append("price", editFormData.price);
      data.append("description", editFormData.description);
      data.append("category", editFormData.category);
      if (imageFile) data.append("image", imageFile);

      const res = await axios.put(`${API_URL}/update/${editFormData._id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        setProductsData(productsData.map(item => 
          item._id === editFormData._id ? res.data.item : item
        ));
        setIsEditing(false);
        alert("Item updated successfully! ");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update item.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure?")) {
      try {
        const res = await axios.delete(`${API_URL}/delete/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          setProductsData(productsData.filter(item => item._id !== itemId));
          setSelectedItem(null);
          alert("Item deleted successfully! ");
        }
      } catch (error) {
        alert(error.response?.data?.message || "Error deleting item.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* --- LEFT SIDEBAR --- */}
      <div className="hidden lg:block w-64 fixed h-full z-40">
        <AdminSidebar />
      </div>

      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
       
        className="flex-1 lg:ml-64 p-4 md:p-10 pt-52 mt-12 pb-20"
      >
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-14 text-center md:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
              Marketplace
            </h1>
            <p className="text-slate-500 text-lg font-medium italic">
              Explore and manage campus deals easily.
            </p>
          </motion.div>

          
          <div className="mb-12 flex flex-col md:flex-row gap-4 p-6 bg-white rounded-4xl border border-slate-200 shadow-xl shadow-slate-100">
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 font-medium transition-all"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-8 py-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-600 cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Books">📚 Books</option>
              <option value="Notes">📝 Notes</option>
              <option value="Electronics">💻 Electronics</option>
              <option value="Furniture">🪑 Furniture</option>
              <option value="Others">✨ Others</option>
            </select>
          </div>

          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-400 font-bold">Loading Marketplace...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              {filteredProducts.map((item) => (
                <motion.div
                  key={item._id}
                  whileHover={{ y: -10 }}
                  
                  className="bg-white rounded-4xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-56 p-3">
                    <img
                      src={item.image?.startsWith("http") ? item.image : `${import.meta.env.VITE_API_URL}/${item.image}`}
                      alt={item.title}
                      
                      className="w-full h-full object-cover rounded-3xl"
                    />
                    <div className="absolute top-6 right-6 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase">
                      {formatTime(item.createdAt)}
                    </div>
                    <div className="absolute bottom-6 left-6 px-5 py-2 bg-orange-500 text-white rounded-2xl text-base font-black shadow-lg">
                      ₹{item.price}
                    </div>
                  </div>

                  <div className="p-7 pt-2 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-800 line-clamp-1 mb-6">{item.title}</h3>
                    <div className="mt-auto">
                      <div className="flex gap-3">
                        <button onClick={() => setSelectedItem(item)} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-black transition-colors shadow-lg">
                          View Details
                        </button>
                        {(item.user?._id === currentUser._id || isAdmin) && (
                          <div className="flex gap-2">
                            <button onClick={() => handleEditClick(item)} className="w-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center font-bold hover:bg-orange-100 transition-colors">✎</button>
                            <button onClick={() => handleDelete(item._id)} className="w-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-bold hover:bg-red-100 transition-colors">🗑️</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* --- MODALS --- */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-100 p-4"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                
                className="bg-white w-full max-w-5xl rounded-4xl p-8 md:p-12 relative flex flex-col md:flex-row gap-10 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => setSelectedItem(null)} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full hover:bg-slate-200 transition-all font-bold">✕</button>
                <div className="flex-1 bg-slate-50 rounded-3xl flex items-center justify-center p-6 border border-slate-100">
                  <img src={selectedItem.image?.startsWith("http") ? selectedItem.image : `${import.meta.env.VITE_API_URL}/${selectedItem.image}`} className="max-h-[50vh] object-contain rounded-xl drop-shadow-xl" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-4xl font-black text-slate-900 mb-5 leading-tight">{selectedItem.title}</h2>
                  <p className="text-slate-500 text-lg mb-8 italic leading-relaxed">"{selectedItem.description}"</p>
                  <p className="text-5xl font-black text-slate-900 mb-10">₹{selectedItem.price}</p>
                  <button onClick={() => navigate(`/seller/${selectedItem.user?._id}`)} className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all">Message Seller</button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {isEditing && (
            <motion.div 
             
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-110 flex items-center justify-center p-4"
              onClick={() => setIsEditing(false)}
            >
              <motion.div 
                className="bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-3xl font-black text-slate-900 mb-8">Update Item</h2>
                <div className="space-y-5">
                  <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-sm font-bold text-slate-400" />
                  <input className="w-full p-5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold" value={editFormData.title} onChange={(e) => setEditFormData({...editFormData, title: e.target.value})} placeholder="Title" />
                  <input className="w-full p-5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold" type="number" value={editFormData.price} onChange={(e) => setEditFormData({...editFormData, price: e.target.value})} placeholder="Price" />
                  <textarea className="w-full p-5 bg-slate-50 border-none rounded-2xl h-32 outline-none focus:ring-2 focus:ring-orange-500 font-bold resize-none" value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} placeholder="Description" />
                </div>
                <div className="flex gap-4 mt-10">
                  <button onClick={() => setIsEditing(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
                  <button 
                    onClick={handleUpdate} 
                    disabled={updating} 
                    
                    className="flex-2 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl disabled:bg-slate-400"
                  >
                    {updating ? "Updating..." : "Update Item"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Marketplace;