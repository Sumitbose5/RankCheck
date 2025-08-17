import { useEffect, useState } from "react";
import { useHeader } from "../context/HeaderContext";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Spinner } from "../extras/Spinner";
import { useUser } from "../context/UserContext";
import axios from 'axios';

const fetchOverallMarks = async (pageNumber, regyear) => {
  try {
    const res = await axios.get(`https://rank-check.vercel.app/student/get-overall-leaderboard/${regyear}?page=${pageNumber}&limit=10`, 
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-200 tracking-wide">📊 Overall Marks</h2>
        </div>

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
                        {student.marks}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-400 italic">
                      No overall marks data available
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

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

export default OverallMarks;