import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      const newPswd = password.trim();
      if (!newPswd) {
        toast.error("Enter valid password");
        setLoading(false);
        return;
      }

      const res = await fetch("https://rank-check.vercel.app/auth/change-pswd", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPswd }),
      });

      const data = await res.json();

      if (data.success) {
        setLoading(false);
        toast.success("Password changed successfully");
        navigate("/login");
      } else {
        setLoading(false);
        toast.error(data.message);
      }
    } catch (err) {
      setLoading(false);
      console.log("Error in change pswd component:", err);
      toast.error("Error in changing password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212] p-4 font-poppins">
      <div className="bg-[#1e1e1e] p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md text-white border border-gray-700">
        <h2 className="text-2xl font-semibold text-center mb-4 font-press-start-2p text-blue-500">New Password</h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          Enter new password below
        </p>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-4 pr-12 py-2 rounded-lg bg-[#121212] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-2 text-gray-400 hover:text-white transition"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          onClick={handleChangePassword}
          disabled={loading}
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </div>
    </div>
  );
};
