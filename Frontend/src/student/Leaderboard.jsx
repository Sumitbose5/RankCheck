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

  useEffect(() => {
    setHeaderText("Leaderboard");
  }, [setHeaderText]);

  const { data, isPending, isFetching, isError, error } = useQuery({
    queryKey: ['rankPages', pageNumber, semester],
    queryFn: () => fetchRank(pageNumber, class_name, semester),
    staleTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData,
  });

  const marksData = data?.marks || [];
  const totalPages = 6; // Adjust this dynamically if needed

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 border border-gray-700">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 items-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-200 tracking-wide">🏆 Leaderboard</h2>
            <span className="text-xs sm:text-sm sm:hidden block rounded-lg text-gray-100 font-semibold">Semester</span>
          </div>
          <Dropdown options={semesters} onSelect={setSemester} width="w-25" selected={semester} />
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full border border-gray-700 rounded-lg overflow-hidden text-xs sm:text-sm md:text-base">
            <thead>
              <tr className="bg-gradient-to-r from-purple-700 to-indigo-700 text-gray-100 text-sm sm:text-base">
                <th className="px-4 sm:px-6 py-2 sm:py-3 text-left">Rank</th>
                <th className="px-4 sm:px-6 py-2 sm:py-3 text-left">Student Name</th>
                <th className="px-4 sm:px-6 py-2 sm:py-3 text-center">Total Marks</th>
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                <tr>
                  <td colSpan="3" className="py-6">
                    <Spinner fullScreen={false} />
                  </td>
                </tr>
              ) : (
                marksData.length > 0 ? (
                  marksData.map((student, index) => (
                    <tr key={index} className="border-t border-gray-700 hover:bg-gray-700 transition duration-200">
                      <td className="px-4 sm:px-6 py-2 sm:py-3 text-left">{student.rank}</td>
                      <td className="px-4 sm:px-6 py-2 sm:py-3">{student.studentName}</td>
                      <td className="px-4 sm:px-6 py-2 sm:py-3 text-center font-semibold">
                        {student.total_marks}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-400 italic">
                      No ranks data available
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
          <button
            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm transition-all ${pageNumber === 1 || isFetching ? "bg-gray-600 cursor-not-allowed opacity-60" : "bg-indigo-600 hover:bg-indigo-500 cursor-pointer"}`}
            disabled={pageNumber === 1 || isFetching}
            onClick={() => setPageNumber((prev) => prev - 1)}
          >
            ⬅ Prev
          </button>
          <span className="px-3 sm:px-4 py-1 sm:py-2 bg-gray-700 rounded-md text-xs sm:text-lg font-semibold">
            {pageNumber}
          </span>
          <button
            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm transition-all ${pageNumber === totalPages || isFetching ? "bg-gray-600 cursor-not-allowed opacity-60" : "bg-indigo-600 hover:bg-indigo-500 cursor-pointer"}`}
            disabled={pageNumber === totalPages || isFetching}
            onClick={() => setPageNumber((prev) => prev + 1)}
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
};