import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // 1. Import Framer Motion
import TeacherSidebar from "./TeacherSidebar";
import Footer from "../component/Footer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isAuthorized = storedUser?.role === "teacher" && storedUser?.isApproved === true;

  const validationSchema = Yup.object({
    title: Yup.string().trim().min(3, "Minimum 3 characters").required("Title is required"),
    subject: Yup.string().trim().required("Subject is required"),
    semester: Yup.string().required("Semester is required"),
    description: Yup.string().trim().min(10, "Minimum 10 characters").required("Description is required"),
    file: Yup.mixed().test("fileRequired", "File is required", function (value) {
      if (isEditing) return true;
      return value !== null;
    }),
  });

  const formik = useFormik({
    initialValues: { id: null, title: "", subject: "", semester: "", description: "", file: null },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("subject", values.subject);
        formData.append("semester", values.semester);
        formData.append("description", values.description);
        if (values.file) formData.append("file", values.file);

        if (isEditing) {
          alert("Update feature implementation pending on backend");
          setIsEditing(false);
          resetForm();
        } else {
          const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/notes/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
          });

          if (res.status === 201) {
            alert("Notes Uploaded Successfully!");
            const newNoteFromDB = {
              id: res.data.newNote._id,
              title: res.data.newNote.title,
              subject: res.data.newNote.subject,
              semester: res.data.newNote.semester,
              description: res.data.newNote.description,
              fileName: res.data.newNote.file.split("/").pop(),
            };
            setNotes([newNoteFromDB, ...notes]);
            resetForm();
            if (document.querySelector('input[type="file"]')) {
              document.querySelector('input[type="file"]').value = "";
            }
          }
        }
      } catch (error) {
        alert(error.response?.data?.message || "Failed to upload notes");
      }
    },
  });

  const handleFileChange = (e) => {
    formik.setFieldValue("file", e.target.files[0]);
  };

  //  Animated Access Denied Screen
  if (!isAuthorized) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col bg-gray-100 pt-28 items-center"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
          className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md border border-red-100"
        >
          <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-6xl mb-4">🚫</motion.div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-6">Only Approved CSE Teachers can upload notes.</p>
          <button onClick={() => navigate("/")} className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition-all active:scale-95">Go to Home</button>
        </motion.div>
        <div className="mt-auto w-full"><Footer /></div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      className="min-h-screen flex flex-col bg-gray-100 pt-24 md:pt-28"
    >
      <div className="flex flex-1">
        <TeacherSidebar />
        <div className="flex-1 p-6 md:pl-8">
          <h2 className="text-3xl font-bold text-black mb-6">CSE Note Management</h2>

          {/*  Animated Form */}
          <motion.form 
            layout
            onSubmit={formik.handleSubmit} 
            className="bg-white shadow-lg rounded-2xl p-6 mb-8 flex flex-col gap-5 max-w-2xl border border-slate-100"
          >
            <h3 className="text-2xl font-semibold text-black">{isEditing ? "Edit Note" : "Upload New CSE Note"}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <input 
                  type="text" 
                  placeholder="Note Title" 
                  {...formik.getFieldProps("title")} 
                  className="border border-slate-300 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-orange-500 outline-none transition-all text-black placeholder:text-black font-medium" 
                />
                <AnimatePresence>
                  {formik.touched.title && formik.errors.title && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="text-red-500 text-sm mt-1">{formik.errors.title}</motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <select 
                  name="semester" 
                  {...formik.getFieldProps("semester")} 
                  className="border border-slate-300 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-orange-500 outline-none bg-white transition-all text-black font-medium"
                >
                  <option value="" className="text-black">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s} className="text-black">{s}th Semester</option>)}
                </select>
                {formik.touched.semester && formik.errors.semester && <p className="text-red-500 text-sm mt-1">{formik.errors.semester}</p>}
              </div>
            </div>

            <div>
              <input 
                type="text" 
                placeholder="Subject (e.g. Operating Systems)" 
                {...formik.getFieldProps("subject")} 
                className="border border-slate-300 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-orange-500 outline-none text-black placeholder:text-black font-medium" 
              />
              {formik.touched.subject && formik.errors.subject && <p className="text-red-500 text-sm mt-1">{formik.errors.subject}</p>}
            </div>

            <div>
              <textarea 
                name="description" 
                rows={3} 
                placeholder="Briefly describe the contents of the notes..." 
                {...formik.getFieldProps("description")} 
                className="border border-slate-300 px-4 py-2 rounded-lg w-full resize-none focus:ring-2 focus:ring-orange-500 outline-none text-black placeholder:text-black font-medium" 
              />
              {formik.touched.description && formik.errors.description && <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>}
            </div>

            <motion.div whileHover={{ scale: 1.01 }} className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 transition-colors hover:bg-orange-50/30">
              <label className="block text-sm font-bold text-black mb-2">Upload PDF / Document</label>
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200" 
              />
              {formik.touched.file && formik.errors.file && <p className="text-red-500 text-sm mt-1">{formik.errors.file}</p>}
            </motion.div>

            <motion.button 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={formik.isSubmitting} 
              className={`px-6 py-3 rounded-xl text-white font-bold transition-all shadow-lg ${formik.isSubmitting ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600 shadow-orange-200"}`}
            >
              {formik.isSubmitting ? "Uploading..." : isEditing ? "Update Note" : "Upload to Portal"}
            </motion.button>
          </motion.form>

          <h3 className="text-2xl font-semibold mb-4 text-slate-800">Your CSE Uploads</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AnimatePresence>
              {notes.map((note, index) => (
                <motion.div 
                  key={note.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white shadow-md rounded-3xl p-6 flex flex-col gap-2 border border-slate-100 hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-1 rounded-md uppercase">Semester {note.semester}</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{note.title}</h4>
                  <p className="text-sm font-medium text-slate-400">{note.subject}</p>
                  <div className="flex gap-2 mt-2">
                      <button className="text-xs font-bold text-red-500 hover:underline">Delete</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default UploadNotes;