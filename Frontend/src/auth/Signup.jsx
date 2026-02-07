import { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import Loader from "../extras/Loader"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { useUser } from "../context/UserContext";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const Signup = () => {

  const [formData, setFormData] = useState({ username: "", email: "", roll_no: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPswd, setShowPswd] = useState(false);
  const { updateUser } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup data : ", formData);

    if (!formData.username.trim() || !formData.email.includes("@")) {
      toast.error("Please enter valid details!");
    }

    setLoading(true); // Start loading state

    const { username, email, roll_no, password } = formData;

    try {
      const res = await fetch(`${VITE_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, roll_no, password }), // Sending email 
      });

      const data = await res.json();

      if (res.ok) {
        setTimeout(() => { // Optional delay for better UI experience
          setLoading(false);
          toast.success("OTP sent to your email")
          navigate("/verify-email", { state: { email, username, roll_no } });
        }, 2000);
      } else {
        setLoading(false);
        toast.error(data.message); // Show error message
      }

    } catch (err) {
      console.log("Login Error ", err);
      setLoading(false);
      alert("Something went wrong!")
    }

  }


  return (
    <div className="flex min-h-dvh flex-col justify-center px-4 md:px-6 py-8 md:py-12 bg-zinc-950 text-white font-mono selection:bg-pink-500">

      {/* Home Button - Chunky Style */}
      <NavLink
        className="fixed top-6 left-6 bg-white text-black p-3 border-4 border-black shadow-[4px_4px_0px_000] hover:bg-lime-400 hover:-translate-y-1 hover:shadow-[6px_6px_0px_000] transition-all duration-200 z-10"
        to="/"
      >
        <GoHomeFill size={24} />
      </NavLink>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Main Signup Card */}
        <div className="bg-zinc-900 border-4 border-white p-8 shadow-[12px_12px_0px_0px_#ec4899] relative">

          {/* Top Header */}
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter inline-block bg-white text-black px-4 py-1 rotate-1">
              NEW_RECRUIT
            </h2>
            <p className="mt-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
          // JOIN_THE_RANKINGS_SYSTEM
            </p>
          </div>

          <form method="POST" className="space-y-4" onSubmit={handleFormSubmit}>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-black uppercase text-pink-500 mb-1 ml-1">
                Handle_Name
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="off"
                placeholder="USER_01"
                className="block w-full bg-zinc-800 border-4 border-white px-4 py-3 text-white font-bold focus:outline-none focus:bg-zinc-700 focus:border-lime-400 transition-all placeholder:text-zinc-600"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-black uppercase text-pink-500 mb-1 ml-1">
                Comm_Channel
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="on"
                placeholder="ABC@MAIL.COM"
                className="block w-full bg-zinc-800 border-4 border-white px-4 py-3 text-white font-bold focus:outline-none focus:bg-zinc-700 focus:border-cyan-400 transition-all placeholder:text-zinc-600"
              />
            </div>

            {/* Roll Number */}
            <div>
              <label htmlFor="roll_no" className="block text-xs font-black uppercase text-pink-500 mb-1 ml-1">
                Uni_Registry_ID
              </label>
              <input
                id="roll_no"
                name="roll_no"
                type="number"
                value={formData.roll_no}
                onChange={handleChange}
                required
                autoComplete="off"
                placeholder="2416XXXXXXX"
                className="block w-full bg-zinc-800 border-4 border-white px-4 py-3 text-white font-bold focus:outline-none focus:bg-zinc-700 focus:border-yellow-400 transition-all placeholder:text-zinc-600"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-black uppercase text-pink-500 mb-1 ml-1">
                Security_Hash
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPswd ? "text" : "password"}
                  required
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full bg-zinc-800 border-4 border-white px-4 py-3 text-white font-bold focus:outline-none focus:bg-zinc-700 focus:border-pink-500 transition-all placeholder:text-zinc-600"
                />
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-white hover:text-pink-500 transition-colors"
                  onClick={() => setShowPswd(!showPswd)}
                >
                  {showPswd ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </span>
              </div>
            </div>

            {/* Submit Button Area */}
            <div className="pt-4">
              {loading ? (
                <div className="border-4 border-dashed border-zinc-700 p-2">
                  <Loader text="Generating_OTP..." />
                </div>
              ) : (
                <button
                  type="submit"
                  className="flex w-full justify-center items-center border-4 border-black bg-pink-600 text-white py-4 text-xl font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_#ffffff] transition-all active:shadow-none active:translate-x-1 active:translate-y-1 cursor-pointer hover:bg-pink-500"
                >
                  Initialize_Account
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t-2 border-dashed border-zinc-700 text-center">
            <p className="text-sm font-bold text-zinc-500 uppercase">
              Already_In_Database?{' '}
              <NavLink to="/login" className="text-white hover:text-cyan-400 underline decoration-cyan-400 underline-offset-4 transition-colors">
                Login_Now
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>


  )
}
