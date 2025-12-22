import { useState } from "react";
import { Key } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const ResetPasswordOTP = () => {
    const [otp, setOtp] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const email = location?.state?.email || "";
    if (!email) toast.error("Email not available in reset-pswd-otp")


    const handleOTPVerification = async () => {
        try {
            setLoading(true);
            const trimmedOTP = otp.trim();
            if (!trimmedOTP) toast.error("Enter valid OTP")

            const res = await fetch("https://rank-check.vercel.app/auth/reset-pswd-otp", {
                method: "POST",
                credentials: "include", // Allow cookies to be sent and received
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ otp: trimmedOTP, email }), // Sending trimmed values
            })

            const data = await res.json();

            if (data.success) {
                setTimeout(() => {
                    setLoading(false);
                    navigate("/change-pswd");
                }, 2000)
            } else {
                setLoading(false);
                toast.error("Incorrect OTP")
            }

        } catch (err) {
            setLoading(false);
            console.log("Error in reset password OTP : ", err);
            toast.error("Incorrect OTP")
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#121212] p-4 font-poppins">
            <div className="bg-[#1e1e1e] p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md text-white border border-gray-700">
                <h2 className="text-2xl font-semibold text-center mb-4 font-press-start-2p text-blue-500">Enter OTP</h2>
                <p className="text-gray-400 text-sm text-center mb-6">
                    Enter the OTP sent to your registered email address
                </p>
                <div className="relative mb-4">
                    <Key className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#121212] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    />
                </div>
                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 cursor-pointer rounded-lg transition disabled:bg-gray-600 disabled:cursor-not-allowed font-semibold"
                    onClick={handleOTPVerification}
                    disabled={loading}
                >
                    {loading ? "Verifying OTP..." : "Verify OTP"}
                </button>

            </div>
        </div>
    );
}
