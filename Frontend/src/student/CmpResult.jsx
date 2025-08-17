import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";
import { fetchMarks } from "../layout/FetchMarks";
import { MarksComparisonChart } from "../utils/MarksChart";
import { fetchCompare } from "../utils/FetchCompare";
import { NotFound } from "../extras/NotFound";

export const CmpResult = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { userData } = useUser();
    const [myData, setMyData] = useState(null);
    const [otherData, setOtherData] = useState(null);


    const handleResult = async () => {
        const opponentData = localStorage.getItem("compare1");
        setLoading(true);

        // ✅ Check if data exists before parsing
        if (!opponentData) {
            toast.error("No data found in localStorage!");
            setLoading(false);
            return;
        }

        let opponentObj;
        try {
            opponentObj = JSON.parse(opponentData);
        } catch (error) {
            console.error("Error parsing localStorage data:", error);
            toast.error("Invalid data format!");
            setLoading(false);
            return;
        }

        // ✅ Ensure both students exist
        if (!opponentObj.student1 || !opponentObj.student2) {
            toast.error("Incomplete student data!");
            setLoading(false);
            return;
        }

        try {
            const student1 = String(opponentObj.student1);
            const student2 = String(opponentObj.student2);
            const semester = String(opponentObj.sem);

            const [yourMarks, otherMarks] = await Promise.all([
                fetchCompare(student1, semester),
                fetchCompare(student2, semester)
            ]);

            // console.log("Your marks:", yourMarks);
            // console.log("Other marks:", otherMarks);

            setMyData(yourMarks);
            setOtherData(otherMarks);
            setLoading(false);
            
        } catch (err) {
            console.error("Error fetching marks:", err);
            setLoading(false);
            // toast.error("Failed to fetch marks! Data Not Available");
            navigate("/student/not-found");
        }
    };


    useEffect(() => {
        handleResult();
    }, []);


    const winnerName = myData?.total_marks === otherData?.total_marks ? "It's a tie" : (myData?.rank < otherData?.rank ? myData?.studentName : otherData?.studentName);
    const subjectMarks1 = myData?.subjectMarks;
    const subjectMarks2 = otherData?.subjectMarks;

    return (
        <div className="bg-gray-900 text-white min-h-screen p-6">

            {/* Loading Modal */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg text-center shadow-lg flex flex-col items-center">
                        <h2 className="text-xl font-bold text-yellow-400 mb-4">Comparing...</h2>
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-500"></div>
                    </div>
                </div>
            )}

            {/* Header with Back Button */}
            <div className="relative sm:mb-6 mb-12">
                {/* Back Button (Positioned Left) */}
                <button
                    onClick={() => navigate("/student/compare")}
                    className="absolute left-0 z-10 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md cursor-pointer"
                >
                    <IoMdArrowBack className="mr-1" /> Back
                </button>


                {/* Centered Heading (Elegant & Eye-Catching) */}
                <h1 className="text-3xl font-bold text-center text-gray-100 tracking-wide relative sm:block hidden">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text drop-shadow-lg">
                        Comparison Result
                    </span>
                </h1>
            </div>


            {/* Comparison Overview */}
            <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-700 text-center mb-2">
                <h2 className="text-2xl md:text-3xl font-bold">
                    <span className="text-white">{myData?.studentName}</span>
                    {/* Versus Animation */}
                    <style>
                        {`
                            @keyframes shimmer {
                                0% { background-position: 0% 50%; }
                                100% { background-position: 100% 50%; }
                            }
                        `}
                    </style>

                    <span className="mx-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 
                animate-[shimmer_2.5s_infinite_alternate] bg-[length:200%_200%]">
                        VS
                    </span>

                    <span className="text-white">{otherData?.studentName}</span>
                </h2>
            </div>


            {/* Winner Section */}
            <div className="relative p-5 rounded-lg text-center mb-4 
                bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                shadow-lg border border-gray-700"
            >
                <h3 className="text-xl font-semibold text-gray-200 tracking-wide">
                    🏆 <span className="text-yellow-400 font-bold">{winnerName}</span>{winnerName !== "It's a tie" ? " is the Winner!" : ""}
                </h3>
            </div>




            {/* Rank & Marks */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-center text-lg font-semibold underline text-white sm:mb-4 mb-1">
                        {myData?.studentName || "Your Name"}
                    </h4>
                    <h4 className="text-lg font-semibold">Rank: <span className="text-blue-400">{myData?.rank}</span></h4>
                    <h4 className="text-lg font-semibold">Total Marks: <span className="text-blue-400">{myData?.total_marks}</span></h4>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-center text-lg font-semibold underline text-white sm:mb-4 mb-1">
                        {otherData?.studentName || "Opponent Name"}
                    </h4>
                    <h4 className="text-lg font-semibold">Rank: <span className="text-blue-400">{otherData?.rank}</span></h4>
                    <h4 className="text-lg font-semibold">Total Marks: <span className="text-blue-400">{otherData?.total_marks}</span></h4>
                </div>
            </div>

            {/* Marks Table */}
            <div className="bg-gray-900 sm:p-6 rounded-xl mt-6 shadow-lg">
                <h3 className="text-xl font-bold mb-6 text-center text-white">📊 Subject-Wise Marks</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Your Marks Table */}
                    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                        <h4 className="text-center text-lg font-semibold underline text-white mb-4">
                            {myData?.studentName || "Your Name"}
                        </h4>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-700 text-white">
                                    <th className="p-3 border-b border-gray-600">Subject</th>
                                    <th className="p-3 border-b border-gray-600">Marks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjectMarks1?.length > 0 ? (
                                    subjectMarks1.map((subject, index) => (
                                        <tr key={index} className="hover:bg-gray-700 transition duration-300">
                                            <td className="p-3 border border-gray-600 text-white">{subject.name}</td>
                                            <td className="p-3 border border-gray-600 text-center text-green-400 font-semibold">
                                                {subject.marks}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="p-4 text-center text-gray-400">
                                            No marks data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Opponent's Marks Table */}
                    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                        <h4 className="text-center text-lg font-semibold underline text-white mb-4">
                            {otherData?.studentName || "Opponent Name"}
                        </h4>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-700 text-white">
                                    <th className="p-3 border-b border-gray-600">Subject</th>
                                    <th className="p-3 border-b border-gray-600">Marks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjectMarks2?.length > 0 ? (
                                    subjectMarks2.map((subject, index) => (
                                        <tr key={index} className="hover:bg-gray-700 transition duration-300">
                                            <td className="p-3 border border-gray-600 text-white">{subject.name}</td>
                                            <td className="p-3 border border-gray-600 text-center text-blue-400 font-semibold">
                                                {subject.marks}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="p-4 text-center text-gray-400">
                                            No marks data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            {/* Graph Placeholder */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 sm:p-6 p-2 pt-4 rounded-2xl mt-6 text-center shadow-lg border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 tracking-wide">📊 Graphical Representation</h3>
                <p className="text-gray-400 text-sm mb-4">Compare your marks visually with an interactive chart.</p>
                <div className="sm:p-4 bg-gray-900 rounded-lg shadow-md">
                    <MarksComparisonChart myMarks={subjectMarks1} otherMarks={subjectMarks2} p1={myData?.studentName} p2={otherData?.studentName} />
                </div>
            </div>

        </div>
    );
};
