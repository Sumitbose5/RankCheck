import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../extras/Loader";

export const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleEmailVerification = async () => {
        try {
            console.log("Inside reset pswd controllwe")
            setLoading(true);

            const res = await fetch("https://rank-check.vercel.app/auth/reset-pswd", {
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
        <div className="relative flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <button className="absolute top-6 left-6 flex items-center text-gray-400 hover:text-white transition cursor-pointer"
                onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2" /> Back
            </button>
            <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-white">
                <h2 className="text-2xl font-semibold text-center mb-4">Reset Password</h2>
                <p className="text-gray-400 text-sm text-center mb-6">
                    Enter your registered email address
                </p>
                <div className="relative mb-4">
                    <Mail className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {loading ? (
                    <Loader text="Sending OTP.." />
                ) : (
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition cursor-pointer"
                        onClick={() => handleEmailVerification()}>
                        Submit
                    </button>
                )}
            </div>
        </div>
    );
}