import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Timer } from "../extras/Timer";
import { useUser } from "../context/UserContext";

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
    }, [])

    const handleOtpVerification = async (inputOtp) => {
        setLoading(true);
        try {
            const { email, roll_no } = location.state || {};
            const res = await fetch("https://rank-check.vercel.app/auth/verify-otp", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inputOtp, email }),
            });
            
            const data = await res.json();
            if (res.ok) {
                toast.success("Logged in successfully!");
                if (data?.nameOfUser && data?.role) {
                    updateUser({ userInfo: data.nameOfUser, role: data.role });
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
    }

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
    }

    const handleTimeout = () => {
        toast.error("OTP expired! Please request a new one.");
    };

    return (
        <div className="min-h-dvh flex justify-center items-center bg-gradient-to-br from-gray-800 to-gray-950 px-4 relative">
            <div className="flex flex-col justify-center items-center backdrop-blur-lg bg-opacity-80 border border-gray-600 w-auto h-auto md:p-10 p-4 rounded-md bg-gray-900 shadow-lg relative">
                {loading && (
                    <div className="absolute inset-0 flex justify-center items-center bg-gray-900 bg-opacity-80 rounded-md">
                        <span className="text-white text-lg font-semibold">Verifying OTP...</span>
                    </div>
                )}
                <h1 className="text-2xl md:text-3xl mb-5 font-semibold text-white">Verify OTP</h1>
                <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3">
                    {otp.map((val, index) => (
                        <input key={index}
                            type="text"
                            ref={(input) => (inputRefs.current[index] = input)}
                            value={val}
                            onChange={(e) => handleChange(index, e)}
                            className="border-2 border-transparent bg-gray-700 min-w-[40px] md:w-16 md:h-16 w-12 h-12 rounded-md text-center text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:bg-gray-800 transition"
                            disabled={loading}
                        />
                    ))}
                </div>
                <Timer onTimeout={handleTimeout} />
            </div>
        </div>
    );
}
