import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const SellItems = () => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const API_URL = `${import.meta.env.VITE_API_URL}/api/items/add`;
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen font-sans"
      >
        <p className="text-slate-500 font-medium text-lg">Please login first to sell items.</p>
      </motion.div>
    );
  }

  const validationSchema = Yup.object({
    title: Yup.string().min(5, "Title too short").required("Title is required"),
    price: Yup.number().positive("Price must be positive").required("Price is required"),
    category: Yup.string().required("Select category"),
    description: Yup.string().min(20, "Please provide more details").required("Description required"),
    contact: Yup.string().matches(/^[0-9]{10}$/, "Invalid phone number").required("Contact required"),
    image: Yup.mixed().required("Image is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      price: "",
      category: "",
      description: "",
      contact: "",
      image: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setSuccess("");
      try {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          formData.append(key, values[key]);
        });

        await axios.post(API_URL, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        setSuccess(" Item listed successfully!");
        setTimeout(() => setSuccess(""), 4000);
        resetForm();
        setPreview(null);
      } catch (err) {
        alert(err?.response?.data?.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    formik.setFieldValue("image", file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    formik.setFieldValue("image", null);
    setPreview(null);
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 font-sans text-sm
    focus:border-orange-500 bg-white
    placeholder:text-slate-400 text-slate-700
    ${formik.touched[field] && formik.errors[field] ? "border-red-300 bg-red-50/20" : "border-slate-200 hover:border-slate-300"}`;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 flex items-start justify-center px-4 py-32 font-sans" // Increased py-32 for top space
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-xl bg-white shadow-sm border border-slate-200 rounded-3xl p-8 md:p-12"
      >
       
        <header className="mb-10 text-center"> 
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Sell Your Item
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Fill in the details to list your item in the marketplace.
          </p>
        </header>

        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium border border-green-100 text-center"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 ml-1">Title</label>
              <input {...formik.getFieldProps("title")} className={inputClass("title")} placeholder="Item Name" />
              {formik.touched.title && formik.errors.title && <p className="text-red-500 text-[11px] mt-1 ml-1">{formik.errors.title}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 ml-1">Price (₹)</label>
              <input {...formik.getFieldProps("price")} className={inputClass("price")} placeholder="0.00" />
              {formik.touched.price && formik.errors.price && <p className="text-red-500 text-[11px] mt-1 ml-1">{formik.errors.price}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 ml-1">Category</label>
            <select {...formik.getFieldProps("category")} className={inputClass("category")}>
              <option value="">Select a category</option>
              {["Books", "Electronics", "Notes", "Furniture", "Others"].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category && <p className="text-red-500 text-[11px] mt-1 ml-1">{formik.errors.category}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 ml-1">Description</label>
            <textarea {...formik.getFieldProps("description")} rows="3" className={`${inputClass("description")} resize-none`} placeholder="Describe condition and age..." />
            {formik.touched.description && formik.errors.description && <p className="text-red-500 text-[11px] mt-1 ml-1">{formik.errors.description}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 ml-1">Contact Number</label>
            <input {...formik.getFieldProps("contact")} className={inputClass("contact")} placeholder="Phone Number" />
            {formik.touched.contact && formik.errors.contact && <p className="text-red-500 text-[11px] mt-1 ml-1">{formik.errors.contact}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 ml-1">Item Photo</label>
            {!preview ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
                <p className="text-xs text-slate-500 font-medium">Click to upload image</p>
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            ) : (
              <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200">
                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-white/90 text-slate-800 px-2 py-1 rounded-lg shadow-sm hover:text-red-500 transition-colors text-[10px] font-bold">
                  ✕ Remove
                </button>
              </div>
            )}
            {formik.touched.image && formik.errors.image && <p className="text-red-500 text-[11px] mt-1 ml-1">{formik.errors.image}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-sm transition-all shadow-sm
              ${loading ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98]"}`}
          >
            {loading ? "Listing Item..." : "List Item Now"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SellItems;