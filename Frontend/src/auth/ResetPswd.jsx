import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../extras/Loader";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleEmailVerification = async () => {
        try {
            console.log("Inside reset pswd controllwe")
            setLoading(true);

            const res = await fetch(`${VITE_BASE_URL}/auth/reset-pswd`, {
                method: "POST",
                credentials: "include", // Allow cookies to be sent and received
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }), // Sending trimmed values
            })

            const data = await res.json();

            if (data.success) {
                setTimeout(() => {
                    setLoading(false);
                    toast.success(`OTP sent to ${email} successfully`);
                    navigate("/reset-pswd-otp", { state: { email } })
                }, 2000)
            } else {
                setLoading(false);
                toast.error(data.message); // Show error message
            }

        } catch (err) {
            console.log("Error in reset password : ", err);
            setLoading(false);
            toast.error("Error in reseting password. Please try again")
        }
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-zinc-950 p-4 font-mono selection:bg-violet-500">
            {/* Back Button - Chunky Retro Style */}
            <button
                className="absolute top-8 left-8 flex items-center bg-white text-black border-4 border-black px-4 py-2 font-black uppercase tracking-tighter hover:bg-cyan-400 hover:-translate-y-1 shadow-[4px_4px_0px_000] active:shadow-none active:translate-y-1 transition-all cursor-pointer z-10"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="mr-2" strokeWidth={3} /> Back
            </button>

            {/* Reset Card */}
            <div className="bg-zinc-900 border-4 border-white p-8 shadow-[12px_12px_0px_0px_#8b5cf6] w-full max-w-md text-white relative">

                {/* Header Decor */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter bg-violet-600 text-white inline-block px-4 py-1 -rotate-1 border-2 border-white mb-4">
                        RECOVER_ACCESS
                    </h2>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                // System_Identity_Verification
                    </p>
                </div>

                <p className="text-zinc-300 text-sm text-center mb-8 font-bold border-l-4 border-violet-500 pl-4 py-2 bg-zinc-800/50">
                    Enter your registered email address to receive a security token.
                </p>

                {/* Input Field */}
                <div className="relative mb-8">
                    <label className="block text-[10px] font-black uppercase text-violet-400 mb-2 ml-1">Registry_Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-10" size={20} />
                        <input
                            type="email"
                            placeholder="USER@DOMAIN.COM"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-zinc-800 border-4 border-white text-white font-black focus:outline-none focus:border-cyan-400 focus:bg-zinc-700 transition-all placeholder:text-zinc-600"
                        />
                    </div>
                </div>

                {/* Action Button */}
                {loading ? (
                    <div className="border-4 border-dashed border-zinc-700 p-2">
                        <Loader text="Generating_Token..." />
                    </div>
                ) : (
                    <button
                        className="w-full bg-violet-600 text-white py-4 border-4 border-black font-black uppercase tracking-widest text-xl shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:bg-violet-500 hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer"
                        onClick={() => handleEmailVerification()}
                    >
                        Submit_Request
                    </button>
                )}

                {/* Bottom Detail */}
                <div className="mt-8 text-center">
                    <span className="text-[10px] font-black text-zinc-600 uppercase italic">
                        Secure_Handshake_Protocol_v4.2
                    </span>
                </div>
            </div>
        </div>
    );
}