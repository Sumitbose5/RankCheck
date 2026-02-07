import { useState } from "react";
import { Key } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

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

            const res = await fetch(`${VITE_BASE_URL}/auth/reset-pswd-otp`, {
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
        <div className="flex items-center justify-center min-h-screen bg-zinc-950 p-4 font-mono selection:bg-lime-400 selection:text-black">
            {/* Main Card */}
            <div className="bg-zinc-900 border-4 border-white p-8 shadow-[12px_12px_0px_0px_#a855f7] w-full max-w-md text-white relative">

                {/* Floating "Security" Label */}
                <div className="absolute -top-4 -left-4 bg-lime-400 text-black px-3 py-1 font-black uppercase text-xs border-2 border-black -rotate-2">
                    SECURE_HANDSHAKE
                </div>

                {/* Header Section */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-white inline-block pb-1 mb-4">
                        Enter_OTP
                    </h2>
                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                        Check your inbox. Enter the <span className="text-white bg-violet-600 px-1">Verification_Code</span> below to proceed.
                    </p>
                </div>

                {/* Input Field with Icon */}
                <div className="relative mb-6">
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 ml-1">
                        Security_Token
                    </label>
                    <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-10" size={20} />
                        <input
                            type="text"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-zinc-800 border-4 border-white text-white font-black text-2xl tracking-[0.5em] focus:outline-none focus:border-lime-400 focus:bg-zinc-700 transition-all placeholder:text-zinc-700 placeholder:tracking-normal"
                        />
                    </div>
                </div>

                {/* Action Button */}
                <button
                    className={`w-full py-4 border-4 border-black font-black uppercase tracking-widest text-xl transition-all shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-1 active:translate-y-1 cursor-pointer
                ${loading
                            ? "bg-zinc-700 text-zinc-500 border-zinc-500 cursor-not-allowed shadow-none translate-x-1 translate-y-1"
                            : "bg-lime-400 text-black hover:bg-white hover:text-black"}`}
                    onClick={handleOTPVerification}
                    disabled={loading}
                >
                    {loading ? "VERIFYING_CODE..." : "Verify_OTP"}
                </button>

                {/* Bottom Decorative Footer */}
                <div className="mt-8 pt-4 border-t-2 border-dashed border-zinc-800 flex justify-between items-center">
                    <span className="text-[9px] font-black text-zinc-600 uppercase">Code_Expiry: 10:00</span>
                    <button className="text-[9px] font-black uppercase text-violet-400 hover:text-lime-400 underline decoration-2 transition-colors">
                        Resend_Token
                    </button>
                </div>
            </div>
        </div>
    );
}
