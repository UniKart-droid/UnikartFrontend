import React, { useState, useRef, useEffect } from 'react'
import { useFormik } from 'formik';
import { signUpSchema } from '../schemas';
import gsap from "gsap";
import axios from "axios";

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirm_password: "",
  sel_role: "",
  student_id: "",
  teacher_id: "",
  admin_id: "",
  id_card: null,
  otp: "", 
}

const Signup = () => {
  const form = useRef();
  const [otpSent, setOtpSent] = useState(false); 
  const [loading, setLoading] = useState(false);
  const headingRef = useRef(null);

  useEffect(() => {
    gsap.to(headingRef.current, {
      y: 20,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  }, []);


  const handleSendOtp = async () => {
    if (!values.email || errors.email) {
      alert("Please enter a valid email first");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/user/send-otp", { 
        email: values.email 
      });
      alert(res.data.message);
      setOtpSent(true);
    } catch (error) {
      alert(error.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const {
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    submitCount,
    setFieldValue,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema: signUpSchema,
    onSubmit: async (values, action) => {
      if (!otpSent) {
        alert("Please verify your email with OTP first");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("confirm_password", values.confirm_password);
        formData.append("sel_role", values.sel_role);
        formData.append("otp", values.otp); 

        
        if (values.sel_role === "teacher") formData.append("teacher_id", values.teacher_id);
        if (values.sel_role === "admin") formData.append("admin_id", values.admin_id);
        if (values.sel_role === "student" && values.id_card) {
          formData.append("id_card", values.id_card);
        }

        const res = await axios.post("http://localhost:8000/api/user/signup", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        alert("Signup successful! Wait for admin approval.");
        action.resetForm();
        setOtpSent(false);

      } catch (error) {
        alert(error.response?.data?.message || "Something went wrong during signup!");
      }
    }
  })

  const inputStyle = "p-3 rounded-lg border w-full mt-1 focus:ring-2 focus:ring-gray-500 bg-white text-black font-medium outline-none border-gray-300";

  return (
    <div className="min-h-screen w-full flex items-start justify-center bg-gray-100 p-4 pt-24">
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* LEFT TEXT */}
        <div className="hidden md:flex w-1/2">
          <h1 ref={headingRef} className="text-gray-900 text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight relative">
            Join UniKart <br />
            <span className="text-gray-700 text-2xl lg:text-3xl font-semibold">& explore smart learning</span>
          </h1>
        </div>

        {/* FORM CONTAINER */}
        <div className="w-full md:w-1/2 bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Create Account</h1>

          <form ref={form} onSubmit={handleSubmit} className="w-full space-y-4">
            
            {/* NAME */}
            <div>
              <label className="text-gray-700 font-semibold">Name</label>
              <input type="text" name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} className={inputStyle} placeholder="Enter your name" />
              {errors.name && submitCount > 0 && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* EMAIL & OTP ACTION */}
            <div>
              <label className="text-gray-700 font-semibold">Email</label>
              <div className="flex gap-2">
                <input type="email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} className={inputStyle} placeholder="Enter your email" />
                <button 
                  type="button" 
                  onClick={handleSendOtp} 
                  disabled={loading || !values.email}
                  className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:bg-gray-400 transition min-w-90px"
                >
                  {loading ? "..." : otpSent ? "Resend" : "Get OTP"}
                </button>
              </div>
              {errors.email && submitCount > 0 && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* OTP INPUT (VISIBLE ONLY AFTER SENDING) */}
            {otpSent && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 transition-all">
                <label className="text-blue-900 font-bold">Verification OTP</label>
                <input 
                  type="text" 
                  name="otp" 
                  maxLength="6"
                  value={values.otp} 
                  onChange={handleChange} 
                  className={`${inputStyle} border-blue-400 text-center text-xl tracking-widest`} 
                  placeholder="000000" 
                />
              </div>
            )}

            {/* PASSWORD FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 font-semibold">Password</label>
                <input type="password" name="password" value={values.password} onChange={handleChange} className={inputStyle} placeholder="Password" />
                {errors.password && submitCount > 0 && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Confirm</label>
                <input type="password" name="confirm_password" value={values.confirm_password} onChange={handleChange} className={inputStyle} placeholder="Confirm" />
                {errors.confirm_password && submitCount > 0 && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
              </div>
            </div>

            {/* ROLE SELECTION */}
            <div>
              <label className="text-gray-700 font-semibold">Role</label>
              <select name="sel_role" value={values.sel_role} onChange={handleChange} className={inputStyle}>
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
              {errors.sel_role && submitCount > 0 && <p className="text-red-500 text-xs mt-1">{errors.sel_role}</p>}
            </div>

            {/* DYNAMIC ROLE FIELDS */}
            {values.sel_role === "student" && (
              <div className="p-2 bg-gray-50 border rounded-lg">
                <label className="text-sm text-gray-600 block mb-1">Upload ID Card (Image)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFieldValue("id_card", e.currentTarget.files[0])} 
                  className="text-black w-full text-sm" 
                />
              </div>
            )}
            {values.sel_role === "teacher" && (
              <input type="text" name="teacher_id" value={values.teacher_id} onChange={handleChange} className={inputStyle} placeholder="Enter Teacher Staff ID" />
            )}
            {values.sel_role === "admin" && (
              <input type="text" name="admin_id" value={values.admin_id} onChange={handleChange} className={inputStyle} placeholder="Enter Admin Access ID" />
            )}

            {/* SUBMIT BUTTON */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-black text-white p-4 rounded-xl hover:bg-gray-800 transition font-bold text-lg mt-4 shadow-md disabled:bg-gray-600"
            >
              {isSubmitting ? "Processing..." : "Complete Signup"}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup;