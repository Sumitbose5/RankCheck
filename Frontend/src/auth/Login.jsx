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
  const navigate = useNavigate();
  const { updateUser } = useUser();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Trim input values before sending
    const trimmedData = data.trim();
    const trimmedPassword = password.trim();

    try {
      const res = await fetch("https://rank-check.vercel.app/auth/login", {
        method: "POST",
        credentials: "include", // Allow cookies to be sent and received
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: trimmedData, password: trimmedPassword }), // Sending trimmed values
      });

      const resget = await res.json(); // named as resget because "data" variable is already in use

      console.log("Role : ", resget?.role);
      console.log("Resget username outside if : ", resget?.username);
      console.log("Resget class_name outside if : ", resget?.class_name);

      if (res.ok) {

        // Show success toast on login
        toast.success("Logged in successfully!");

        if (resget?.username && resget?.class_name && resget?.role) {
          console.log("Resget username inside if : ", resget.username);
          console.log("Resget class_name inside if : ", resget.class_name); 
          console.log("Resget role inside if : ", resget.role);

          updateUser({ userInfo: resget.username, class_name: resget.class_name, role: resget.role });
        }
        else {
          console.error("nameOfUser is missing in response:", data);
        }


        if (resget.role === "Admin") {
          navigate("/admin/marks-control");
        }
        else if (resget.role === "Student") {    // i think there is problem while redirecting directly to "/dashboard" page
          navigate("/student/dashboard", { state: { data: trimmedData } }); // Redirect to student dashboard
        }
        else {
          console.log("Error in Logging in User!");
          alert("Errorrrr!!!")
        }

      } else {
        toast.error("Invalid Credentials!");
      }

    } catch (err) {
      console.log("Error in Login (frontend) : ", err);
    }
  };


  return (
    <div className="flex h-dvh flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-[#121212] text-gray-300">

      {/* Home Button */}
      <NavLink className="bg-indigo-600 hover:bg-indigo-500 w-8 p-2 rounded-md font-semibold" to="/">
        <GoHomeFill />
      </NavLink>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://i.ibb.co/Y70nqZwZ/finalimg.png"
          className="mx-auto h-10 w-12 rounded-full"
        />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight">
          Sign in to your account
        </h2>
      </div>

      {/* Form Section */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6" onSubmit={handleFormSubmit}>

          {/* Email / Username Input */}
          <div>
            <label htmlFor="data" className="block text-sm font-medium text-gray-400">
              Email address / Username
            </label>
            <div className="mt-2">
              <input
                id="data"
                name="data"
                type="text"
                value={data}
                onChange={(e) => setData(e.target.value.trim())}
                required
                autoComplete="on"
                className="block w-full rounded-md bg-[#1e1e1e] border border-gray-700 px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 sm:text-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                Password
              </label>
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
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-300"
                onClick={() => setShowPswd(!showPswd)}
              >
                {showPswd ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300 cursor-pointer"
            >
              Sign in
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


  )
}
