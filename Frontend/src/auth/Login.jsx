import { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { useUser } from "../context/UserContext";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

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
      const res = await fetch(`${VITE_BASE_URL}/auth/login`, {
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
    <div className="flex min-h-dvh flex-col justify-center px-4 md:px-6 py-8 md:py-12 bg-zinc-950 text-white font-mono selection:bg-blue-500">

      {/* Home Button - Chunky Style */}
      <NavLink
        className="fixed top-6 left-6 bg-white text-black p-3 border-4 border-black shadow-[4px_4px_0px_000] hover:bg-cyan-400 hover:-translate-y-1 hover:shadow-[6px_6px_0px_000] transition-all duration-200 z-10"
        to="/"
      >
        <GoHomeFill size={24} />
      </NavLink>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Main Login Card */}
        <div className="bg-zinc-900 border-4 border-white p-8 shadow-[12px_12px_0px_0px_#3b82f6] relative">

          {/* Top Header */}
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter inline-block bg-white text-black px-4 py-1 -rotate-2">
              AUTH_SYSTEM
            </h2>
            <p className="mt-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
          // ACCESS_RESTRICTED_AREA
            </p>
          </div>

          {/* Form Section */}
          <form action="#" method="POST" className="space-y-6" onSubmit={handleFormSubmit}>

            {/* Email / Username Input */}
            <div>
              <label htmlFor="data" className="block text-xs font-black uppercase text-blue-400 mb-1 ml-1">
                Identity_Token
              </label>
              <input
                id="data"
                name="data"
                type="text"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
                autoComplete="on"
                placeholder="EMAIL_OR_USERNAME"
                className="block w-full bg-zinc-800 border-4 border-white px-4 py-3 text-white font-bold focus:outline-none focus:bg-zinc-700 focus:border-cyan-400 transition-all placeholder:text-zinc-600"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1 ml-1">
                <label htmlFor="password" className="block text-xs font-black uppercase text-blue-400">
                  Access_Key
                </label>
                <NavLink to="/reset-pswd" className="text-[10px] font-black uppercase text-pink-500 hover:underline decoration-2">
                  Lost_Key?
                </NavLink>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPswd ? "text" : "password"}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full bg-zinc-800 border-4 border-white px-4 py-3 text-white font-bold focus:outline-none focus:bg-zinc-700 focus:border-pink-500 transition-all placeholder:text-zinc-600"
                />
                {/* Eye Icon inside the Input */}
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-white hover:text-cyan-400 transition-colors"
                  onClick={() => setShowPswd(!showPswd)}
                >
                  {showPswd ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`flex w-full justify-center items-center border-4 border-black py-4 text-xl font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_#ffffff] transition-all active:shadow-none active:translate-x-1 active:translate-y-1 cursor-pointer
              ${loading
                    ? "bg-zinc-600 text-zinc-400 shadow-none translate-x-1 translate-y-1"
                    : "bg-blue-600 text-white hover:bg-cyan-500 hover:text-black"
                  }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-t-4 border-white rounded-full mr-3" />
                    VERIFYING...
                  </>
                ) : (
                  "Login_To_Terminal"
                )}
              </button>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-10 pt-6 border-t-2 border-dashed border-zinc-700 text-center">
            <p className="text-sm font-bold text-zinc-500 uppercase">
              New_Recruit?{" "}
              <NavLink to="/signup" className="text-white hover:text-yellow-400 underline decoration-yellow-400 underline-offset-4 transition-colors">
                Register_Here
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};