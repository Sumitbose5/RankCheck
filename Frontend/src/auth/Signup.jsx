import { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import Loader from "../extras/Loader"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { useUser } from "../context/UserContext";

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
      const res = await fetch("https://rank-check.vercel.app/auth/signup", {
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
    <div className="flex min-h-dvh flex-1 flex-col justify-center px-4 md:px-6 py-8 md:py-12 lg:px-8 bg-[#121212] text-gray-200 font-poppins">

      <NavLink className="bg-indigo-600 hover:bg-indigo-500 w-8 p-2 rounded-md font-semibold transition duration-300" to="/">
        <GoHomeFill />
      </NavLink>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-5 text-center text-2xl font-bold tracking-tight font-press-start-2p text-blue-500">
          Register
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form method="POST" className="space-y-4" onSubmit={handleFormSubmit}>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="off"
                className="block w-full rounded-md bg-[#1e1e1e] px-3 py-2 text-base text-gray-200 outline-none border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm transition duration-300"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="on"
                className="block w-full rounded-md bg-[#1e1e1e] px-3 py-2 text-base text-gray-200 outline-none border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm transition duration-300"
              />
            </div>
          </div>

          {/* Roll Number */}
          <div>
            <label htmlFor="roll_no" className="block text-sm font-medium">
              Roll Number
            </label>
            <div className="mt-2">
              <input
                id="roll_no"
                name="roll_no"
                type="number"
                value={formData.roll_no}
                onChange={handleChange}
                required
                autoComplete="off"
                className="block w-full rounded-md bg-[#1e1e1e] px-3 py-2 text-base text-gray-200 outline-none border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm transition duration-300"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={showPswd ? "text" : "password"}
                required
                onChange={handleChange}
                autoComplete="current-password"
                className="block w-full rounded-md bg-[#1e1e1e] px-3 py-2 text-base text-gray-200 outline-none border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm pr-10 transition duration-300"
              />
              {/* Eye Icon */}
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-200"
                onClick={() => setShowPswd(!showPswd)}
              >
                {showPswd ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            {loading ? (
              <Loader text="Sending OTP..." />
            ) : (
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm cursor-pointer font-semibold text-white shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-600 transition duration-300"
              >
                Register
              </button>
            )}
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-300">
          Already have an Account?{' '}
          <NavLink to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Login
          </NavLink>
        </p>
      </div>
    </div>


  )
}
