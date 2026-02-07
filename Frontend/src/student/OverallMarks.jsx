import { useEffect, useState } from "react";
import { useHeader } from "../context/HeaderContext";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Spinner } from "../extras/Spinner";
import { useUser } from "../context/UserContext";
import axios from 'axios';

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchOverallMarks = async (pageNumber, regyear) => {
  try {
    const res = await axios.get(`${VITE_BASE_URL}/student/get-overall-leaderboard/${regyear}?page=${pageNumber}&limit=10`,
      { withCredentials: true });
    return res.data || [];
  } catch (err) {
    console.log("Error in fetch overall marks: ", err);
    throw err;
  }
};

const OverallMarks = () => {
  const { setHeaderText } = useHeader();
  const [pageNumber, setPageNumber] = useState(1);
  const { userData } = useUser();

  const regyear = userData?.regyear || "Not Available";

  useEffect(() => {
    setHeaderText("Overall Marks");
  }, [setHeaderText]);

  const { data, isPending, isFetching, isError, error } = useQuery({
    queryKey: ['overallMarks', pageNumber, regyear],
    queryFn: () => fetchOverallMarks(pageNumber, regyear),
    staleTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData,
  });

  const marksData = data?.marks || [];
  const totalPages = 6;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-zinc-950 text-white p-2 xs:p-4 sm:p-8 font-mono">
  {/* Cumulative Header - Responsive Scaling */}
  <div className="w-full max-w-4xl mb-6 sm:mb-8 text-center sm:text-left">
    <div className="bg-pink-600 border-4 border-white p-3 sm:p-4 shadow-[6px_6px_0px_0px_#22c55e] sm:shadow-[8px_8px_0px_0px_#22c55e] -rotate-1 inline-block">
      <h2 className="text-xl xs:text-2xl sm:text-5xl font-black uppercase tracking-tighter text-white leading-none">
        📊 OVERALL_STANDING
      </h2>
    </div>
    <p className="mt-4 text-zinc-400 font-bold uppercase tracking-widest text-[10px] sm:text-sm px-2">
      // Cumulative performance: All Semesters
    </p>
  </div>

  <div className="w-full max-w-4xl bg-zinc-900 border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] sm:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] p-3 sm:p-8 relative overflow-hidden">
    
    {/* Background Detail for Mobile */}
    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
        <span className="text-6xl font-black italic">XP</span>
    </div>

    {/* Table Section - Optimized for small screens */}
    <div className="overflow-x-auto border-4 border-black mb-6">
      <table className="w-full text-left border-collapse bg-zinc-900 min-w-[320px]">
        <thead>
          <tr className="bg-cyan-400 text-black border-b-4 border-black">
            <th className="px-3 py-3 sm:px-4 sm:py-4 font-black uppercase italic tracking-tighter text-xs sm:text-base">Rank</th>
            <th className="px-3 py-3 sm:px-4 sm:py-4 font-black uppercase text-xs sm:text-base">Legend</th>
            <th className="px-3 py-3 sm:px-4 sm:py-4 font-black uppercase text-center text-xs sm:text-base">Total_XP</th>
          </tr>
        </thead>
        <tbody>
          {isFetching ? (
            <tr>
              <td colSpan="3" className="py-20 text-center">
                <div className="inline-block animate-bounce font-black text-lg sm:text-2xl text-pink-500 uppercase italic">
                  Syncing_Legends...
                </div>
              </td>
            </tr>
          ) : (
            marksData.length > 0 ? (
              marksData.map((student, index) => (
                <tr 
                  key={index} 
                  className="border-b-2 border-zinc-800 hover:bg-zinc-800 transition-all group"
                >
                  <td className="px-3 py-4 sm:px-4 sm:py-5">
                    <div className={`inline-block px-2 py-1 sm:px-3 sm:py-1 font-black text-sm sm:text-xl border-2 border-white 
                      ${student.rank === 1 ? "bg-yellow-400 text-black -rotate-6" : 
                        student.rank === 2 ? "bg-zinc-300 text-black -rotate-3" : 
                        student.rank === 3 ? "bg-orange-400 text-black rotate-2" : "bg-black text-white"}`}>
                      #{student.rank}
                    </div>
                  </td>
                  <td className="px-3 py-4 sm:px-4 sm:py-5 font-black uppercase tracking-tight text-xs sm:text-base group-hover:text-pink-500 transition-colors truncate max-w-[100px] xs:max-w-[150px] sm:max-w-none">
                    {student.studentName}
                  </td>
                  <td className="px-3 py-4 sm:px-4 sm:py-5 text-center">
                    <span className="text-lg sm:text-2xl font-black tabular-nums bg-white text-black px-1 sm:px-2 border-2 border-black group-hover:bg-cyan-400 transition-colors">
                      {student.marks}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-12 text-center font-black uppercase text-zinc-600 text-xs sm:text-sm">
                  {"[!] NO_REGISTRY_DATA"}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>

    {/* Funky Pagination - Wrapped for Mobile */}
    <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-10 mb-4">
      <button
        className={`px-4 py-2 sm:px-6 sm:py-2 border-4 border-black font-black uppercase text-xs sm:text-base transition-all shadow-[4px_4px_0px_000] active:translate-y-1 active:shadow-none 
          ${pageNumber === 1 || isFetching ? "bg-zinc-800 text-zinc-600 border-zinc-600 shadow-none" : "bg-white text-black hover:bg-lime-400"}`}
        disabled={pageNumber === 1 || isFetching}
        onClick={() => setPageNumber((prev) => prev - 1)}
      >
        {"<<"} PREV
      </button>

      <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-pink-600 border-4 border-black text-white font-black text-lg sm:text-xl rotate-3 shadow-[4px_4px_0px_000]">
        {pageNumber}
      </div>

      <button
        className={`px-4 py-2 sm:px-6 sm:py-2 border-4 border-black font-black uppercase text-xs sm:text-base transition-all shadow-[4px_4px_0px_000] active:translate-y-1 active:shadow-none 
          ${pageNumber === totalPages || isFetching ? "bg-zinc-800 text-zinc-600 border-zinc-600 shadow-none" : "bg-white text-black hover:bg-cyan-400"}`}
        disabled={pageNumber === totalPages || isFetching}
        onClick={() => setPageNumber((prev) => prev + 1)}
      >
        NEXT {">>"}
      </button>
    </div>
  </div>
</div>
  );
};

export default OverallMarks;