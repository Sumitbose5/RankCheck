import { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { useUser } from "../context/UserContext";


export const Login = () => {
  const [data, setData] = useState("");
  const [password, setPassword] = useState("");
  const [showPswd, setShowPswd] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loader
  const navigate = useNavigate();
  const { updateUser } = useUser();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Start loading
    const trimmedData = data.trim();
    const trimmedPassword = password.trim();

    try {
      const res = await fetch("https://rank-check.vercel.app/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: trimmedData, password: trimmedPassword }),
      });

      const resget = await res.json();

      if (res.ok) {
        toast.success("Logged in successfully!");

        if (resget?.username && resget?.class_name && resget?.role) {
          updateUser({ userInfo: resget.username, class_name: resget.class_name, role: resget.role, regyear: resget.regyear, rollNo: resget.roll_no });
        } else {
          console.error("nameOfUser is missing in response:", data);
        }

        if (resget.role === "Admin") {
          navigate("/admin/marks-control");
        } else if (resget.role === "Student") {
          navigate("/student/dashboard", { state: { data: trimmedData } });
        } else {
          console.log("Error in Logging in User!");
          alert("Errorrrr!!!");
        }
      } else {
        toast.error("Invalid Credentials!");
      }
    } catch (err) {
      console.log("Error in Login (frontend) : ", err);
      toast.error("Something went wrong! Try again.");
    } finally {
      setLoading(false); // Stop loading after request is complete
    }
  };

  return (
    <div className="flex min-h-dvh flex-1 flex-col justify-center px-4 md:px-6 py-8 md:py-12 lg:px-8 bg-[#121212] text-gray-300 font-poppins">
      {/* Home Button */}
      <NavLink className="bg-indigo-600 hover:bg-indigo-500 w-8 p-2 rounded-md font-semibold transition duration-300" to="/">
        <GoHomeFill />
      </NavLink>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* <img alt="Your Company" src="https://i.ibb.co/Y70nqZwZ/finalimg.png" className="mx-auto h-10 w-12 rounded-full" /> */}
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight font-press-start-2p text-blue-500">Login</h2>
      </div>

      {/* Form Section */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6" onSubmit={handleFormSubmit}>
          {/* Email / Username Input */}
          <div>
            <label htmlFor="data" className="block text-sm font-medium text-gray-400">Email address / Username</label>
            <div className="mt-2">
              <input
                id="data"
                name="data"
                type="text"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
                autoComplete="on"
                className="block w-full rounded-md bg-[#1e1e1e] border border-gray-700 px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 sm:text-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
              <div className="text-sm">
                <NavLink to="/reset-pswd" className="font-semibold text-indigo-500 hover:text-indigo-400">
                  Forgot password?
                </NavLink>
              </div>
            </div>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={showPswd ? "text" : "password"}
                required
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="block w-full rounded-md bg-[#1e1e1e] border border-gray-700 px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 sm:text-sm pr-10"
              />
              {/* Eye Icon inside the Input */}
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-300" onClick={() => setShowPswd(!showPswd)}>
                {showPswd ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-md transition duration-300 cursor-pointer ${loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
                }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        {/* Register Link */}
        <p className="mt-10 text-center text-sm text-gray-400">
          Don't have an Account?{" "}
          <NavLink to="/signup" className="font-semibold text-indigo-500 hover:text-indigo-400">
            Register Now
          </NavLink>
        </p>
      </div>
    </div>
  );
};