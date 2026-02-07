import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useUser } from "../context/UserContext";
import { useHeader } from "../context/HeaderContext";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const SettingUp = () => {
    const [loader, setLoader] = useState(true);
    const [statusText, setStatusText] = useState("INITIALIZING_HANDSHAKE");
    const navigate = useNavigate();
    const location = useLocation();
    const { updateUser } = useUser();
    const { setHeaderText } = useHeader();

    useEffect(() => {
        setHeaderText("Setting Up");
    }, [setHeaderText]);

    const roll_no = location.state?.roll_no;
    const email = location.state?.email;

    // Funky status text rotation
    useEffect(() => {
        const statuses = [
            "CONNECTING_TO_REGISTRY...",
            "FETCHING_ACADEMIC_DATA...",
            "CALCULATING_RANKS...",
            "FINALIZING_PROFILE..."
        ];
        let i = 0;
        const interval = setInterval(() => {
            setStatusText(statuses[i % statuses.length]);
            i++;
        }, 700);
        return () => clearInterval(interval);
    }, []);

    const updateUserMarks = async () => {
        try {
            const res = await axios.post(`${VITE_BASE_URL}/student/test1`,
                { roll_no },
                { withCredentials: true }
            );

            if (res.status === 200) {
                const class_name = res?.data?.class_name;
                if (class_name) {
                    updateUser({ class_name: class_name });
                }
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        }

        setTimeout(() => {
            setLoader(false);
            navigate("/student/dashboard", { state: { data: email } });
        }, 3000);
    };

    useEffect(() => {
        updateUserMarks();
    }, []);

    return (
        <div className="min-h-screen bg-zinc-950 font-mono overflow-hidden">
            {loader && (
                <div className="fixed inset-0 flex flex-col items-center justify-center p-6 z-[200] bg-zinc-950">
                    {/* Background Visual Detail */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-32 bg-lime-400/5 -rotate-12 blur-3xl pointer-events-none" />

                    <div className="relative w-full max-w-sm sm:max-w-md bg-zinc-900 border-4 border-white p-8 shadow-[12px_12px_0px_0px_#22c55e]">
                        {/* Header Tag */}
                        <div className="absolute -top-5 left-6 bg-violet-600 text-white px-4 py-1 font-black uppercase text-xs border-2 border-black rotate-[-2deg]">
                            System_Config
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 uppercase tracking-tighter italic">
                                Setting_Up <span className="animate-pulse text-lime-400">...</span>
                            </h2>

                            {/* Funky Mechanical Loader */}
                            <div className="w-full h-8 bg-zinc-800 border-4 border-white relative mb-6 overflow-hidden">
                                <div className="h-full bg-lime-400 border-r-4 border-white animate-[load_3s_ease-in-out_infinite]"
                                    style={{ width: '40%' }}></div>
                            </div>

                            <p className="text-cyan-400 font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] h-4">
                                {statusText}
                            </p>
                        </div>

                        {/* Bottom Detail */}
                        <div className="mt-10 pt-4 border-t-2 border-dashed border-zinc-800 flex justify-between items-center opacity-50">
                            <span className="text-[8px] font-black uppercase text-zinc-500">Node_01</span>
                            <span className="text-[8px] font-black uppercase text-zinc-500">KCC_Rankings_v2</span>
                        </div>
                    </div>

                    {/* Mobile Hint */}
                    <p className="mt-8 text-zinc-600 text-[10px] font-black uppercase tracking-widest animate-bounce">
                        Booting_Academic_Module
                    </p>
                </div>
            )}

            <style jsx>{`
                @keyframes load {
                    0% { width: 0%; left: 0; }
                    50% { width: 100%; left: 0; }
                    100% { width: 0%; left: 100%; }
                }
            `}</style>
        </div>
    );
};