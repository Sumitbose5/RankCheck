import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Timer } from "../extras/Timer";
import { useUser } from "../context/UserContext";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const OTP = () => {
    const [otp, setOtp] = useState(new Array(4).fill(""));
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { updateUser } = useUser();

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleOtpVerification = async (inputOtp) => {
        setLoading(true);
        try {
            const { email, roll_no } = location.state || {};
            const res = await fetch(`${VITE_BASE_URL}/auth/verify-otp`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inputOtp, email }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Logged in successfully!");
                if (data?.nameOfUser && data?.role) {
                    updateUser({ userInfo: data.nameOfUser, role: data.role, regyear: data.regyear, rollNo: data.roll_no });
                }
                if (data.role === "Admin") {
                    navigate("/admin/marks-control");
                } else if (data.role === "Student") {
                    navigate("/student/setup", { state: { roll_no, email } });
                }
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Error in verifying OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (index, e) => {
        const val = e.target.value;
        if (isNaN(val)) return;
        const newOtp = [...otp];
        newOtp[index] = val.substring(val.length - 1);
        setOtp(newOtp);
        const combinedOtp = newOtp.join("");
        if (combinedOtp.length === 4) {
            handleOtpVerification(combinedOtp);
        }
        if (val && index < 3 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleTimeout = () => {
        toast.error("OTP expired! Please request a new one.");
    };

    return (
        <div className="min-h-dvh flex justify-center items-center bg-zinc-950 px-4 relative font-mono">
            {/* Background Text Decor */}
            <div className="absolute top-10 left-10 opacity-10 select-none pointer-events-none hidden md:block">
                <span className="text-8xl font-black text-white italic">CODE_CHECK</span>
            </div>

            <div className="flex flex-col justify-center items-center bg-zinc-900 border-4 border-white p-8 md:p-12 shadow-[16px_16px_0px_0px_#8b5cf6] relative max-w-lg w-full">
                
                {/* Loading State Overlay */}
                {loading && (
                    <div className="absolute inset-0 z-50 flex flex-col justify-center items-center bg-black/90 border-4 border-white">
                        <div className="animate-spin h-12 w-12 border-t-4 border-violet-500 border-solid rounded-full mb-4"></div>
                        <span className="text-white text-xl font-black uppercase italic tracking-widest">Verifying...</span>
                    </div>
                )}

                {/* Header Tag */}
                <div className="bg-white text-black px-4 py-1 font-black uppercase tracking-tighter mb-8 -rotate-1 border-2 border-black shadow-[4px_4px_0px_0px_#22c55e]">
                    Security_Protocol
                </div>

                <h1 className="text-3xl md:text-4xl mb-6 font-black text-white uppercase tracking-tighter text-center">
                    Verify <span className="text-violet-500 italic">OTP</span>
                </h1>
                
                <p className="text-zinc-500 text-xs font-bold uppercase mb-8 tracking-widest text-center">
                    Enter the 4-digit token sent to your terminal
                </p>

                <div className="flex justify-center items-center gap-4 mb-10">
                    {otp.map((val, index) => (
                        <input key={index}
                            type="text"
                            ref={(input) => (inputRefs.current[index] = input)}
                            value={val}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="0"
                            className="bg-zinc-800 border-4 border-white md:w-20 md:h-24 w-14 h-18 text-center text-3xl font-black text-white focus:border-lime-400 focus:bg-zinc-700 outline-none transition-all placeholder:text-zinc-700 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px]"
                            disabled={loading}
                        />
                    ))}
                </div>

                {/* Timer Section */}
                <div className="w-full flex justify-between items-center border-t-2 border-dashed border-zinc-800 pt-6">
                    <span className="text-[10px] font-black text-zinc-600 uppercase">Handshake_Expiry:</span>
                    <div className="text-lime-400 font-black">
                        <Timer onTimeout={handleTimeout} />
                    </div>
                </div>
                
                <button className="mt-8 text-xs font-black uppercase text-violet-400 hover:text-white underline decoration-2 transition-all">
                    Resend_Auth_Packet
                </button>
            </div>
        </div>
    );
}