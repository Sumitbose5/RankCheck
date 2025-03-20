import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useUser } from "../context/UserContext";
import { useHeader } from "../context/HeaderContext";

export const SettingUp = () => {
    const [loader, setLoader] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { updateUser } = useUser();   // changes ----------->
    const [className, setClassName] = useState("");
    const { setHeaderText } = useHeader();

    // Updates the header text
    useEffect(() => {
        setHeaderText("Setting Up");  // Update header when mounted
    }, [setHeaderText]);

    const roll_no = location.state?.roll_no;
    const email = location.state?.email;

    const updateUserMarks = async () => {
        try {
            // const res = await axios.get("http://localhost:3000/student/test1", {
            //     params: { roll_no },
            //     withCredentials: true
            // });

            const res = await axios.post("http://localhost:3000/student/test1",
                { roll_no },  // Request body
                { withCredentials: true }  // Axios config (correct placement)
            );


            if (res.status === 200) {
                const class_name = res?.data?.class_name;
                console.log("Classname inside setting up from res : ", class_name);
                if (class_name) {
                    updateUser({ class_name: class_name });   // changes =--------------------->
                }
                console.log("Data fetched successfully");
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        }

        // ✅ Loader stays visible for 3 seconds, then hides & navigates
        setTimeout(() => {
            setLoader(false);
            navigate("/student/dashboard", { state: { data: email } });
        }, 3000);
    };

    useEffect(() => {
        updateUserMarks();
    }, []);

    return (
        <>
            {loader && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white">
                    <h2 className="text-xl font-semibold mb-4 animate-pulse">
                        Getting things ready...
                    </h2>
                    <SpinnyLoader />
                </div>
            )}
        </>
    );
};

// ✅ Reusable Loader Component
const SpinnyLoader = () => {
    return (
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-75"></div>
    );
};
