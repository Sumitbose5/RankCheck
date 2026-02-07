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
        <div className="bg-zinc-950 text-white min-h-screen p-4 sm:p-8 font-mono selection:bg-yellow-400 selection:text-black">
            {/* Loading Overlay - Neo-Brutalist Style */}
            {loading && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] backdrop-blur-sm">
                    <div className="bg-white border-4 border-black p-8 text-center shadow-[10px_10px_0px_0px_#facc15] flex flex-col items-center">
                        <h2 className="text-2xl font-black text-black mb-4 uppercase italic">Crunching_Numbers...</h2>
                        <div className="animate-spin h-12 w-12 border-t-4 border-b-4 border-black rounded-full"></div>
                    </div>
                </div>
            )}

            {/* Header & Back Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
                <button
                    onClick={() => navigate("/student/compare")}
                    className="group bg-zinc-800 border-2 border-white px-6 py-2 font-black uppercase tracking-tighter hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_#fff] active:shadow-none active:translate-x-1 active:translate-y-1"
                >
                    [←] BACK_TO_LOBBY
                </button>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter bg-white text-black px-4 py-1 -rotate-1 shadow-[4px_4px_0px_0px_#8b5cf6]">
                    Analysis_Output
                </h1>
            </div>

            {/* Versus Header Box */}
            <div className="bg-zinc-900 border-4 border-white p-6 mb-6 text-center shadow-[10px_10px_0px_0px_#22c55e] relative overflow-hidden">
                <div className="absolute top-0 left-0 bg-zinc-700 text-[10px] px-2 font-black">MATCHUP_v2.0</div>
                <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter flex flex-wrap justify-center items-center gap-4">
                    <span className="text-cyan-400 underline decoration-white">{myData?.studentName}</span>
                    <span className="bg-pink-600 px-3 py-1 skew-x-12 border-2 border-black text-white italic">VS</span>
                    <span className="text-yellow-400 underline decoration-white">{otherData?.studentName}</span>
                </h2>
            </div>

            {/* Winner Banner */}
            <div className="bg-yellow-400 border-4 border-black p-4 text-center mb-8 rotate-1 shadow-[8px_8px_0px_0px_#000]">
                <h3 className="text-2xl font-black text-black uppercase tracking-widest italic animate-pulse">
                    🏆 {winnerName} {winnerName !== "It's a tie" ? "DOMINATES!" : "STALEMATE!"}
                </h3>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <div className="bg-zinc-800 border-4 border-cyan-400 p-6 shadow-[6px_6px_0px_0px_#22d3ee]">
                    <h4 className="text-xl font-black uppercase mb-4 text-cyan-400 border-b-2 border-dashed border-cyan-900">P1_STATS</h4>
                    <div className="space-y-2 font-bold uppercase">
                        <p className="flex justify-between">Rank: <span>#{myData?.rank}</span></p>
                        <p className="flex justify-between">Total Marks: <span className="text-2xl font-black">{myData?.total_marks}</span></p>
                    </div>
                </div>
                <div className="bg-zinc-800 border-4 border-yellow-400 p-6 shadow-[6px_6px_0px_0px_#facc15]">
                    <h4 className="text-xl font-black uppercase mb-4 text-yellow-400 border-b-2 border-dashed border-yellow-900">P2_STATS</h4>
                    <div className="space-y-2 font-bold uppercase">
                        <p className="flex justify-between">Rank: <span>#{otherData?.rank}</span></p>
                        <p className="flex justify-between">Total Marks: <span className="text-2xl font-black">{otherData?.total_marks}</span></p>
                    </div>
                </div>
            </div>

            {/* Comparison Tables Split */}
            <div className="bg-zinc-900 border-4 border-white p-4 sm:p-8 shadow-[10px_10px_0px_0px_#ec4899] mb-10">
                <h3 className="text-2xl font-black uppercase mb-8 italic border-b-4 border-white inline-block">Subject_Breakdown</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Table 1 */}
                    <div className="overflow-hidden border-2 border-zinc-700">
                        <table className="w-full text-left">
                            <thead className="bg-cyan-400 text-black">
                                <tr>
                                    <th className="p-3 font-black uppercase">Subject</th>
                                    <th className="p-3 font-black uppercase text-center">Marks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-zinc-800">
                                {subjectMarks1?.map((sub, i) => (
                                    <tr key={i} className="hover:bg-zinc-800">
                                        <td className="p-3 font-bold uppercase text-xs">{sub.name}</td>
                                        <td className="p-3 text-center font-black text-xl text-cyan-400">{sub.marks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Table 2 */}
                    <div className="overflow-hidden border-2 border-zinc-700">
                        <table className="w-full text-left">
                            <thead className="bg-yellow-400 text-black">
                                <tr>
                                    <th className="p-3 font-black uppercase">Subject</th>
                                    <th className="p-3 font-black uppercase text-center">Marks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-zinc-800">
                                {subjectMarks2?.map((sub, i) => (
                                    <tr key={i} className="hover:bg-zinc-800">
                                        <td className="p-3 font-bold uppercase text-xs">{sub.name}</td>
                                        <td className="p-3 text-center font-black text-xl text-yellow-400">{sub.marks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Graphical Section */}
            <div className="bg-white text-black border-4 border-black p-6 shadow-[12px_12px_0px_0px_#8b5cf6]">
                <h3 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-2">
                    <span className="bg-black text-white px-2">DATA</span> Visualizer
                </h3>
                <div className="bg-zinc-100 border-4 border-black p-4">
                    <MarksComparisonChart
                        myMarks={subjectMarks1}
                        otherMarks={subjectMarks2}
                        p1={myData?.studentName}
                        p2={otherData?.studentName}
                    />
                </div>
            </div>
        </div>
    );
};
