import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async() => {
    try{

        const newPswd = password.trim();
        if(!newPswd) toast.error("Enter valid password");

        const res = await fetch("http://localhost:3000/auth/change-pswd", {
            method: "POST",
            credentials: "include", // Allow cookies to be sent and received
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newPswd }), // Sending trimmed values
        })

        const data = await res.json();

        if(data.success) {
            toast.success("Password changed successfully")
            navigate("/login");
        }

    } catch(err) {
        console.log("Error in change pswd component : ", err);
        toast.error("Error in changing password")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-white">
        <h2 className="text-2xl font-semibold text-center mb-4">New Password</h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          Enter new password below
        </p>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-4 pr-12 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-2 text-gray-400 hover:text-white transition"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition cursor-pointer"
        onClick={() => handleChangePassword()}>
          Change Password
        </button>
      </div>
    </div>
  );
}
