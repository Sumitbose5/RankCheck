import { useEffect, useState } from "react";
import { useHeader } from "../context/HeaderContext";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Spinner } from "../extras/Spinner";
import { fetchRank } from "../utils/FetchRanks";
import { Dropdown } from "../extras/Dropdown";
import { useUser } from "../context/UserContext";

const semesters = ["I", "II", "III", "IV", "V", "VI"];

export const Leaderboard = () => {
  const { setHeaderText } = useHeader();
  const [pageNumber, setPageNumber] = useState(1);
  const [semester, setSemester] = useState("I");
  const { userData } = useUser();

  const class_name = userData?.class_name || "Not Available";
  const regyear = userData?.regyear || "Not Available";

  useEffect(() => {
    setHeaderText("Leaderboard");
  }, [setHeaderText]);

  const { data, isPending, isFetching, isError, error } = useQuery({
    queryKey: ['rankPages', pageNumber, semester],
    queryFn: () => fetchRank(pageNumber, regyear, semester),
    staleTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData,
  });

  const marksData = data?.marks || [];
  const totalPages = 6; // Adjust this dynamically if needed

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-zinc-950 text-white p-2 sm:p-4 md:p-8 font-mono">
      <div className="w-full max-w-4xl bg-zinc-900 border-4 border-white shadow-[8px_8px_0px_0px_#f97316] sm:shadow-[12px_12px_0px_0px_#f97316] p-4 sm:p-8 relative">

        {/* Floating Decoration - Hidden on very small screens to save space */}
        <div className="absolute -top-6 -right-2 bg-lime-400 text-black px-3 py-1 font-black uppercase text-xs sm:text-sm border-2 border-black rotate-3 hidden xs:block">
          Live_Rankings
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10 gap-6">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            {/* Responsive Heading: Text scales from 3xl to 6xl */}
            <h2 className="text-3xl xs:text-4xl sm:text-6xl font-black uppercase italic tracking-tighter text-transparent stroke-white"
              style={{ WebkitTextStroke: '1px white' }}>
              Leader<span className="text-white">Board</span>
            </h2>
            <p className="text-[10px] sm:text-xs font-bold text-orange-500 uppercase tracking-widest mt-1">
              Class_of_2026_Rankings
            </p>
          </div>

          {/* Filter Section - Centered on Mobile */}
          <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
            <label className="text-[10px] font-black uppercase text-zinc-500 mb-1">Filter_Semester</label>
            <div className="border-4 border-white bg-zinc-800 w-full sm:w-32">
              <Dropdown options={semesters} onSelect={setSemester} width="w-full" selected={semester} />
            </div>
          </div>
        </div>

        {/* Table Section - With horizontal scroll for mobile */}
        <div className="overflow-x-auto border-4 border-white">
          <table className="w-full text-left border-collapse min-w-[300px]">
            <thead>
              <tr className="bg-white text-black border-b-4 border-white text-xs sm:text-base">
                <th className="px-3 py-3 sm:px-4 sm:py-4 font-black uppercase tracking-tighter">Rank</th>
                <th className="px-3 py-3 sm:px-4 sm:py-4 font-black uppercase tracking-tighter">Student_ID</th>
                <th className="px-3 py-3 sm:px-4 sm:py-4 font-black uppercase tracking-tighter text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                <tr>
                  <td colSpan="3" className="py-20 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-4 border-orange-500 mr-2"></div>
                    <span className="font-black uppercase tracking-widest italic text-xs sm:text-sm">Syncing_Data...</span>
                  </td>
                </tr>
              ) : (
                marksData.length > 0 ? (
                  marksData.map((student, index) => (
                    <tr key={index} className="border-b-2 border-zinc-800 hover:bg-zinc-800 transition-all group">
                      <td className="px-3 py-4 sm:px-4">
                        <span className={`text-sm sm:text-xl font-black px-2 py-1 border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] 
                      ${student.rank === 1 ? "bg-yellow-400 text-black" : "bg-black text-white"}`}>
                          {student.rank < 10 ? `0${student.rank}` : student.rank}
                        </span>
                      </td>
                      <td className="px-3 py-4 sm:px-4 font-bold uppercase text-xs sm:text-sm group-hover:text-cyan-400 transition-colors truncate max-w-[120px] sm:max-w-none">
                        {student.studentName}
                      </td>
                      <td className="px-3 py-4 sm:px-4 text-center">
                        <span className="text-lg sm:text-2xl font-black italic text-orange-500 group-hover:text-white">
                          {student.total_marks}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-10 text-center font-black uppercase text-zinc-600 italic text-xs sm:text-sm">
                      -- NO_LEGENDS_FOUND --
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls - Stacked/Simplified for Mobile */}
        <div className="flex flex-col xs:flex-row justify-center items-center gap-3 mt-8">
          <div className="flex gap-2 w-full xs:w-auto justify-center">
            <button
              className={`flex-1 xs:flex-none p-2 sm:p-3 border-4 border-black font-black uppercase text-xs sm:text-base transition-all shadow-[4px_4px_0px_000] active:translate-y-1 active:shadow-none 
          ${pageNumber === 1 || isFetching ? "bg-zinc-700 text-zinc-500" : "bg-white text-black hover:bg-pink-500"}`}
              disabled={pageNumber === 1 || isFetching}
              onClick={() => setPageNumber((prev) => prev - 1)}
            >
              {"<<"}
            </button>

            <div className="px-4 py-2 bg-black border-4 border-white text-lime-400 text-sm sm:text-xl font-black italic shadow-[4px_4px_0px_000] whitespace-nowrap">
              PG_{pageNumber}
            </div>

            <button
              className={`flex-1 xs:flex-none p-2 sm:p-3 border-4 border-black font-black uppercase text-xs sm:text-base transition-all shadow-[4px_4px_0px_000] active:translate-y-1 active:shadow-none 
          ${pageNumber === totalPages || isFetching ? "bg-zinc-700 text-zinc-500" : "bg-white text-black hover:bg-cyan-500"}`}
              disabled={pageNumber === totalPages || isFetching}
              onClick={() => setPageNumber((prev) => prev + 1)}
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};