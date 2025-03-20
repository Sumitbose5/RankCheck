import { useEffect, useState } from "react";
import { Dropdown } from "../extras/Dropdown";
import axios from "axios";
import toast from "react-hot-toast";
import { useHeader } from "../context/HeaderContext";
import { Spinner } from "../extras/Spinner";


const semesters = ["I", "II", "III", "IV", "V", "VI"];
const years = Array.from({ length: 11 }, (_, i) => (2022 + i).toString());

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
                axios.post("http://localhost:3000/student/fetchMarks",
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
            const res = await axios.post("http://localhost:3000/student/fetchSingleMarks",
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
    },[])

    if(loading) return <Spinner/>

    return (
        <div className="p-10 text-white flex flex-col lg:flex-row justify-center items-start gap-12 lg:gap-20">
            <section className="w-full max-w-lg p-8 bg-gray-800 rounded-lg shadow-lg flex flex-col">
                <h2 className="text-2xl font-bold mb-6">Fetch Marks for Class</h2>
                <input type="text" placeholder="Marks Data Name" value={classNameClass} onChange={(e) => setClassNameClass(e.target.value)} className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white mb-4" />
                <div className="flex flex-col gap-3 mb-4">
                    <label className="text-sm font-medium">Semester</label>
                    <Dropdown options={semesters} onSelect={setSemesterClass} selected={semesterClass} />
                </div>
                <div className="flex flex-col gap-3 mb-4">
                    <label className="text-sm font-medium">Registration Year</label>
                    <Dropdown options={years} onSelect={setYearClass} selected={yearClass} />
                </div>
                <div className="flex gap-4 mb-4">
                    <input type="text" placeholder="Roll No From" value={rollFrom} onChange={(e) => setRollFrom(e.target.value)} className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white" />
                    <input type="text" placeholder="Roll No To" value={rollTo} onChange={(e) => setRollTo(e.target.value)} className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white" />
                </div>
                <button
                    onClick={fetchMarksForClass}
                    disabled={!isClassFormValid || loading}
                    className={`w-full p-3 rounded font-medium transition-all cursor-pointer ${(!isClassFormValid || loading)
                        ? "bg-gray-500 cursor-not-allowed opacity-50"
                        : "bg-blue-600 hover:bg-blue-500"}`}
                >
                    {loading ? "Fetching..." : "Fetch Marks"}
                </button>
            </section>

            <section className="w-full max-w-lg p-8 bg-gray-800 rounded-lg shadow-lg flex flex-col">
                <h2 className="text-2xl font-bold mb-6">Fetch Marks for a Single Student</h2>
                <input type="text" placeholder="Marks Data Name" value={classNameStudent} onChange={(e) => setClassNameStudent(e.target.value)} className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white mb-4" />
                <div className="flex flex-col gap-3 mb-4">
                    <label className="text-sm font-medium">Semester</label>
                    <Dropdown options={semesters} onSelect={setSemesterStudent} selected={semesterStudent} />
                </div>
                <div className="flex flex-col gap-3 mb-4">
                    <label className="text-sm font-medium">Registration Year</label>
                    <Dropdown options={years} onSelect={setYearStudent} selected={yearStudent} />
                </div>
                <input type="text" placeholder="Roll Number" value={singleRoll} onChange={(e) => setSingleRoll(e.target.value)} className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white mb-4" />

                <button
                    onClick={fetchMarksForStudent}
                    disabled={!isStudentFormValid || loading}
                    className={`w-full p-3 rounded font-medium transition-all cursor-pointer ${(!isStudentFormValid || loading)
                        ? "bg-gray-500 cursor-not-allowed opacity-50"
                        : "bg-blue-600 hover:bg-blue-500"}`}
                >
                    {loading ? "Fetching..." : "Fetch Marks"}
                </button>
            </section>
        </div>
    );
};
