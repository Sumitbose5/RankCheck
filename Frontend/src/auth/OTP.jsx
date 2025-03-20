import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Timer } from "../extras/Timer";
import { useUser } from "../context/UserContext";


export const OTP = () => {

    const [otp, setOtp] = useState(new Array(4).fill(""));
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
        try {

            const { email, roll_no } = location.state || {};

            const res = await fetch("https://rank-check.vercel.app/auth/verify-otp", {
                method: "POST",
                credentials: "include", // Allow cookies to be sent and received
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inputOtp, email }), // Sending email
            })

            const data = await res.json();
            // setUserData(data);  // here the user data has no marks element inside the marks array

            if (res.ok) {

                // Show success toast on login 
                toast.success("Logged in successfully!"); 
                // updateUser({userInfo : data?.nameOfUser});   // update the user in Local Storage
                if (data?.nameOfUser && data?.role) {
                    updateUser({ userInfo: data.nameOfUser, role: data.role });
                } else {
                    console.error("nameOfUser is missing in response:", data);
                }
    

                if (data.role === "Admin") {
                    navigate("/admin/marks-control");
                }
                else if (data.role === "Student") {
                    // redirecting to setting up page to show the modal and fetch data from marks DB for the new user
                    navigate("/student/setup", { state: { roll_no: roll_no, email: email } });
                }
                else {
                    console.log("Some error in handleOtpVerification");
                    alert("Errorrrr!!!")
                }

            } else {
                console.log("Response not OK : ", data.message);
                toast.error(data.message);
            }

        } catch (err) {
            console.log(err);
            alert("Error in verifying OTP")
        }
    }

    const handleChange = (index, e) => {
        const val = e.target.value;
        if (isNaN(val)) return;

        const newOtp = [...otp];
        // allow only one input
        newOtp[index] = val.substring(val.length - 1);
        setOtp(newOtp);

        // submit trigger
        const combinedOtp = newOtp.join("");
        if (combinedOtp.length === 4) {
            // console.log("OTP : ", combinedOtp);
            handleOtpVerification(combinedOtp);
        }

        // Move to next input if current field is filled
        if (val && index < 3 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    }

    const handleClick = (index) => {
        inputRefs.current[index].setSelectionRange(1, 1);
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            // Moving cursor to the previous input field on pressing backspace
            inputRefs.current[index - 1].focus();
        }
    }

    const handleTimeout = () => {
        toast.error("OTP expired! Please request a new one.");
    };

    return (
        <div className="min-h-dvh flex justify-center items-center bg-gradient-to-br from-gray-800 to-gray-950 px-4">
            {/* OTP Box */}
            <div className="flex flex-col justify-center items-center backdrop-blur-lg bg-opacity-80 border border-gray-600 w-auto h-auto md:p-10 p-4 rounded-md bg-gray-900 shadow-lg">
                <h1 className="text-2xl md:text-3xl mb-5 font-semibold text-white">
                    Verify OTP
                </h1>

                <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3">
                    {otp.map((val, index) => (
                        <input key={index}
                            type="text"
                            ref={(input) => (inputRefs.current[index] = input)}
                            value={val}
                            onChange={(e) => handleChange(index, e)}
                            onClick={() => handleClick(index)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="border-2 border-transparent bg-gray-700 min-w-[40px] md:w-16 md:h-16 w-12 h-12 rounded-md text-center text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:bg-gray-800 transition"
                        />
                    ))}
                </div>

                <Timer onTimeout={handleTimeout} />
            </div>
        </div>


    );
}