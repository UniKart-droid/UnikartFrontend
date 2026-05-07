import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Marketplace = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const API_URL = `${import.meta.env.VITE_API_URL}/api/items/all`;
  

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL);
      setProductsData(res.data.items || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

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
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  // --- Handle Update Logic ---
  const handleEditClick = (item) => {
    setSelectedItem(null); 
    setEditFormData(item);
    setImageFile(null); 
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      
      const data = new FormData();
      data.append("title", editFormData.title);
      data.append("price", editFormData.price);
      data.append("description", editFormData.description);
      data.append("category", editFormData.category);
      
     
      if (imageFile) {
        data.append("image", imageFile);
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/items/update/${editFormData._id}`, 
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", 
          },
        }
      );

      if (res.status === 200) {
        
        setProductsData(productsData.map(item => 
          item._id === editFormData._id ? res.data.item : item
        ));
        setIsEditing(false);
        alert("Item updated successfully! ");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert(error.response?.data?.message || "Failed to update item.");
    }
  };

  // --- Handle Delete Logic ---
  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      try {
        const res = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/items/delete/${itemId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status === 200) {
          setProductsData(productsData.filter(item => item._id !== itemId));
          setSelectedItem(null);
          alert("Item deleted successfully! ");
        }
      } catch (error) {
        console.error("Delete failed:", error);
        alert(error.response?.data?.message || "Error deleting item.");
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-28 pb-12 px-4 md:px-12 bg-slate-50 font-sans"
    >
      {/* --- HERO SECTION --- */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto mb-12 text-center md:text-left"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-3">
          Deals for Students, by Students
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl font-medium italic">
          "Don't Trash It, Cash It — The smartest marketplace for your campus."
        </p>
      </motion.div>

      {/* --- SEARCH & FILTERS --- */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row gap-4 p-4 bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200 shadow-sm"
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search for books, notes, or gadgets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-6 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-orange-500 transition-all outline-none text-slate-700 font-medium"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-orange-500 outline-none font-semibold text-slate-600 cursor-pointer transition-all"
        >
          <option value="All">All Categories</option>
          <option value="Books"> Books</option>
          <option value="Notes"> Notes</option>
          <option value="Electronics"> Electronics</option>
          <option value="Furniture"> Furniture</option>
          <option value="Others"> Others</option>
        </select>
      </motion.div>

      {/* --- PRODUCTS GRID --- */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium">Fetching the latest items...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-medium">
            No items found in this category.
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredProducts.map((item) => (
              <motion.div
                key={item._id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-52 overflow-hidden p-3">
                  <img
                    src={item.image?.startsWith("http") ? item.image : `${import.meta.env.VITE_API_URL}/${item.image}`}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute top-5 right-5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                    {formatTime(item.createdAt)}
                  </div>
                  <div className="absolute bottom-5 left-5 px-4 py-1.5 bg-orange-500 text-white rounded-xl text-sm font-bold shadow-md">
                    ₹{item.price}
                  </div>
                </div>

                <div className="p-6 pt-2 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1 mb-4">
                    {item.title}
                  </h3>

                  <div className="mt-auto space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
                      >
                        View Details
                      </button>
                      
                      {/* --- Conditional Owner Controls --- */}
                      {item.user?._id === currentUser._id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="w-10 h-11 bg-orange-100 text-orange-600 rounded-xl font-bold flex items-center justify-center hover:bg-orange-200 transition-colors"
                            title="Edit"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="w-10 h-11 bg-red-100 text-red-600 rounded-xl font-bold flex items-center justify-center hover:bg-red-200 transition-colors"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => navigate(`/seller/${item.user?._id}`)}
                      className="w-full py-2 text-xs font-bold text-slate-400 hover:text-orange-600 transition-colors border-t border-slate-50 pt-3"
                    >
                       Chat with Seller
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* --- ITEM DETAILS MODAL --- */}
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-4xl rounded-4xl shadow-2xl p-6 md:p-10 relative flex flex-col md:flex-row gap-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-all"
              >
                ✕
              </button>

              <div className="flex-1 bg-slate-50 rounded-2xl p-2 flex items-center justify-center">
                <img
                  src={selectedItem.image?.startsWith("http") ? selectedItem.image : `${import.meta.env.VITE_API_URL}/${selectedItem.image}`}
                  className="max-h-[40vh] object-contain rounded-lg"
                  alt="Selected item"
                />
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <span className="text-orange-600 font-bold uppercase tracking-widest text-[10px] mb-2 block">
                  {selectedItem.category}
                </span>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{selectedItem.title}</h2>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed italic">"{selectedItem.description}"</p>
                <p className="text-3xl font-bold text-slate-900 mb-8">₹{selectedItem.price}</p>

                <div className="bg-slate-50 p-5 rounded-2xl mb-8 border border-slate-100">
                  <p className="text-[10px] text-slate-400 mb-2 font-bold uppercase tracking-wider">Seller Info</p>
                  <p className="text-slate-700 font-bold text-sm mb-1">👤 {selectedItem.user?.name || "Verified Seller"}</p>
                  <p className="text-slate-500 text-xs">📧 {selectedItem.user?.email || "N/A"}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/seller/${selectedItem.user?._id}`)}
                    className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all"
                  >
                    Message Seller
                  </button>
                  
                  {selectedItem.user?._id === currentUser._id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(selectedItem)}
                        className="bg-slate-100 text-slate-600 px-6 rounded-xl font-bold hover:bg-slate-200 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(selectedItem._id)}
                        className="bg-red-50 text-red-600 px-4 rounded-xl font-bold hover:bg-red-100 transition-all"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- EDIT ITEM MODAL --- */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-110 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEditing(false)}
          >
            <motion.div 
              className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative max-h-[95vh] overflow-y-auto"
              initial={{ y: 50, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-black text-slate-900 mb-6">Update Your Item</h2>
              
              <div className="space-y-5">
                {/* Image Update Field */}
                <div>
                  <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1 block mb-1">Product Image</label>
                  <div className="relative group overflow-hidden rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 hover:border-orange-400 transition-all">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="p-4 flex flex-col items-center justify-center text-center">
                      {imageFile ? (
                        <div className="space-y-2">
                            <p className="text-sm font-bold text-orange-600">Selected: {imageFile.name}</p>
                            <p className="text-[10px] text-slate-400">Click or drag to replace</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-2xl">📸</p>
                          <p className="text-xs font-bold text-slate-500">Tap to change image</p>
                          <p className="text-[10px] text-slate-400">Leave empty to keep current</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1 block mb-1">Title</label>
                  <input 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-semibold text-black placeholder:text-slate-400"
                    placeholder="Enter title"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1 block mb-1">Price (₹)</label>
                    <input 
                      type="number"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-semibold text-black"
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1 block mb-1">Category</label>
                    <select
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-semibold text-black cursor-pointer"
                      value={editFormData.category}
                      onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                    >
                      <option value="Books">Books</option>
                      <option value="Notes">Notes</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1 block mb-1">Description</label>
                  <textarea 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-semibold text-black h-28 resize-none placeholder:text-slate-400"
                    placeholder="Describe your item..."
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-700 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdate}
                  className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-black transition-all"
                >
                  Update Item
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Marketplace;