import { useEffect, useState } from "react";
import { Dropdown } from "../extras/Dropdown";
import axios from "axios";
import toast from "react-hot-toast";
import { useHeader } from "../context/HeaderContext";
import { Spinner } from "../extras/Spinner";


const semesters = ["I", "II", "III", "IV", "V", "VI"];
const years = Array.from({ length: 11 }, (_, i) => (2022 + i).toString());

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const MarksControl = () => {
    const [semesterClass, setSemesterClass] = useState(semesters[0]);
    const [yearClass, setYearClass] = useState(years[0]);

    const [semesterStudent, setSemesterStudent] = useState(semesters[0]);
    const [yearStudent, setYearStudent] = useState(years[0]);

    const [classNameClass, setClassNameClass] = useState("");
    const [classNameStudent, setClassNameStudent] = useState("");
    const [rollFrom, setRollFrom] = useState("");
    const [rollTo, setRollTo] = useState("");
    const [singleRoll, setSingleRoll] = useState("");
    const [loading, setLoading] = useState(true);
    const { setHeaderText } = useHeader();

    useEffect(() => {
        setHeaderText("Marks Control");
    }, [setHeaderText]);

    const isClassFormValid = semesterClass && yearClass && classNameClass && rollFrom && rollTo;
    const isStudentFormValid = semesterStudent && yearStudent && classNameStudent && singleRoll;

    const fetchMarksForClass = async () => {
        if (!isClassFormValid) {
            toast.error("Please fill all fields before fetching marks.");
            return;
        }

        // console.log("Sem : ", semesterClass);
        // console.log("year : ", yearClass);
        // console.log("class_name : ", classNameClass);
        // console.log("rollFrom : ", rollFrom);
        // console.log("rollto : ", rollTo);

        setLoading(true);
        try {
            const res = await toast.promise(
                axios.post(`${VITE_BASE_URL}/student/fetchMarks`,
                    { semester: semesterClass, year: yearClass, class_name: classNameClass, rollFrom, rollTo },
                    { headers: { "Content-Type": "application/json" } }
                ).then(response => {
                    if (!response.data.success) {
                        throw new Error(response.data.message || "Failed to fetch marks.");
                    }
                    return response;
                }),
                {
                    pending: "Fetching Marks...",
                    success: "Marks fetched successfully! 🎉",
                    error: "Failed to fetch marks. Try again!" // This is a generic error, but we'll override it in catch
                }
            );
        } catch (err) {
            console.error("Error in fetch marks for class:", err);

            // Extract error message from response
            const errorMessage = err.response?.data?.message || err.message || "Something went wrong!";

            // Display the actual error message using toast
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const fetchMarksForStudent = async () => {
        if (!isStudentFormValid) {
            toast.error("Please fill all fields before fetching marks.");
            return;
        }

        try {
            const res = await axios.post(`${VITE_BASE_URL}/student/fetchSingleMarks`,
                { semester: semesterStudent, year: yearStudent, class_name: classNameStudent, singleRoll },
                { headers: { "Content-Type": "application/json" } }
            );

            if (res.data.success) {
                toast.success("Marks fetched successfully!");
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.log(err.message);
            toast.error("Marks already present in the DB");
        }
    };

    useEffect(() => {
        setLoading(false);
    }, [])

    if (loading) return <Spinner />

    return (
        <div className="p-4 sm:p-10 flex flex-col justify-center items-center font-mono bg-zinc-950 min-h-screen">
    {/* Main Container - Width adjusts based on screen size */}
    <section className="w-full max-w-lg p-6 sm:p-8 bg-zinc-900 border-4 border-white shadow-[8px_8px_0px_0px_#8b5cf6] sm:shadow-[12px_12px_0px_0px_#8b5cf6] flex flex-col relative overflow-hidden">
        
        {/* Floating Background Accent for Mobile */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none select-none hidden sm:block">
            <span className="text-9xl font-black italic">FETCH</span>
        </div>

        {/* Funky Heading - Responsive padding and text size */}
        <h2 className="text-2xl sm:text-3xl font-black mb-6 uppercase tracking-tight bg-violet-600 text-white border-b-4 border-white -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 p-4 italic">
            ⚡ Fetch_Marks
        </h2>

        {/* Marks Data Name Input */}
        <div className="mb-4">
            <label className="block text-xs sm:text-sm font-black uppercase mb-1 text-violet-400 ml-1">Data_Handle</label>
            <input 
                type="text" 
                placeholder="Ex: Spring 2026 Finals" 
                value={classNameClass} 
                onChange={(e) => setClassNameClass(e.target.value)} 
                className="w-full p-3 bg-zinc-800 border-4 border-white text-white font-bold focus:border-lime-400 outline-none placeholder:text-zinc-600 transition-all text-sm sm:text-base" 
            />
        </div>

        {/* Dropdowns Container - Stacks on tiny screens, Grid on larger */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1">
                <label className="text-[10px] sm:text-xs font-black uppercase text-violet-400 ml-1">Semester</label>
                <div className="border-4 border-white bg-zinc-800 text-white">
                    <Dropdown options={semesters} onSelect={setSemesterClass} selected={semesterClass} width="w-full" />
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] sm:text-xs font-black uppercase text-violet-400 ml-1">Reg_Year</label>
                <div className="border-4 border-white bg-zinc-800 text-white">
                    <Dropdown options={years} onSelect={setYearClass} selected={yearClass} width="w-full" />
                </div>
            </div>
        </div>

        {/* Roll Range Section - Improved spacing for mobile thumbs */}
        <div className="mb-8">
            <label className="block text-xs sm:text-sm font-black uppercase mb-2 text-violet-400 ml-1 text-center sm:text-left underline decoration-white underline-offset-4">
                Roll_Number_Range
            </label>
            <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 items-center">
                <input 
                    type="text" 
                    placeholder="FROM" 
                    value={rollFrom} 
                    onChange={(e) => setRollFrom(e.target.value)} 
                    className="w-full p-3 bg-zinc-800 border-4 border-white text-white font-bold focus:border-pink-500 outline-none text-center" 
                />
                <div className="font-black text-white italic text-xs rotate-0 xs:rotate-0">TO</div>
                <input 
                    type="text" 
                    placeholder="TO" 
                    value={rollTo} 
                    onChange={(e) => setRollTo(e.target.value)} 
                    className="w-full p-3 bg-zinc-800 border-4 border-white text-white font-bold focus:border-pink-500 outline-none text-center" 
                />
            </div>
        </div>

        {/* Action Button - High Contrast and Responsive Height */}
        <button
            onClick={fetchMarksForClass}
            disabled={!isClassFormValid || loading}
            className={`w-full py-4 border-4 border-white font-black uppercase tracking-widest text-lg sm:text-xl transition-all shadow-[6px_6px_0px_0px_#ffffff] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] 
                ${(!isClassFormValid || loading)
                    ? "bg-zinc-700 text-zinc-500 border-zinc-500 cursor-not-allowed shadow-none"
                    : "bg-lime-400 text-black hover:bg-white cursor-pointer"}`}
        >
            {loading ? "SEARCHING..." : "GET_DATA →"}
        </button>
    </section>
</div>
    );
};
