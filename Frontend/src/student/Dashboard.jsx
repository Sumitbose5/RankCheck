import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useHeader } from "../context/HeaderContext";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"
import { fetchMarks } from "../layout/FetchMarks";
import { useUser } from "../context/UserContext";
import { Spinner } from "../extras/Spinner";
import { Dropdown } from "../extras/Dropdown";

const semesters = ["I", "II", "III", "IV", "V", "VI"];

export const Dashboard = () => {
  const { setHeaderText } = useHeader();
  const [semester, setSemester] = useState("I");
  const location = useLocation();
  const { userData, updateUser } = useUser();

  // Updates the header text
  useEffect(() => {
    setHeaderText("Dashboard");  // Update header when mounted
  }, [setHeaderText]);

  const userDetails = location.state?.data || userData?.userInfo || {};

  // console.log("User info in dashboard : ", userData?.userInfo);

  // console.log("User Details : ", userDetails);
  // console.log("User Data : ", userData);

  const { data, isPending, error, isError } = useQuery({
    queryKey: ['marksData', semester],  // instead of userDetails pass semester
    queryFn: () => fetchMarks(userDetails, semester),  // with userDetails pass semester to fetch the data for that semester
    staleTime: 1000 * 60 * 10,
  })

  // console.log("Semester : ", semester);
  // console.log("Data TS Query : ", data);

  if (isPending) return <Spinner />;
  if (isError) return <p className="text-red-400">Data not found! {error}</p>;

  const marksID = data?.marksID;
  const subjectMarks = data?.subjectMarks || [];
  const percentage = data?.percentage;
  const total_marks = data?.total_marks;
  const studentName = data?.studentName;
  const bestScoringSubject = data?.bestScoringSubject;
  const worstScoringSubject = data?.worstScoringSubject;
  const rank = data?.rank;
  const rank1_tot = data?.rank1tot_marks;
  const rank3_tot = data?.rank3tot_marks;
  const rank10_tot = data?.rank10tot_marks;
  const class_name = data?.class_name;

  // console.log("ClassName : ", class_name);

  // useEffect(() => {
  //   updateUser({class_name: class_name});
  // }, [class_name])

  return (
    <div className="sm:p-6 p-2">
      {/* Welcome Section */}
      <div className="flex justify-start items-center pb-4">
        <h1 className="text-lg md:text-xl font-bold ">
          <span className="bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text tracking-wide">Welcome, {userData?.userInfo}</span> 👋
        </h1>
      </div>

      {/* Semester Marks Heading + Rank Box + Dropdown */}
      <div className="border-b border-gray-600 py-4 flex flex-col items-center md:flex-row md:items-center md:justify-between gap-4">

        {/* Heading (Centered on small screens, left-aligned on larger screens) */}
        <h1 className="text-xl md:text-2xl font-semibold text-center md:text-left">
          Semester Marks Table
        </h1>

        <div className="flex justify-between sm:w-1/2 w-[300px]">
          {/* Rank Box - Moves below the heading on smaller screens */}
          <div
            className={`relative p-2 rounded-md text-white shadow-md w-[130px] text-center
  transition-all duration-300 hover:scale-105
  ${rank === 1
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 border-2 border-yellow-300 animate-pulse"
                : rank <= 3
                  ? "bg-gradient-to-r from-gray-300 to-blue-400 border border-gray-200"
                  : rank <= 5
                    ? "bg-gradient-to-r from-yellow-800 to-orange-600 border border-orange-500"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600"
              }`}
          >
            <h2 className="text-xs font-semibold tracking-wide">Rank</h2>
            <span className="text-lg font-bold">{rank || "N/A"}</span>

            {/* Soft Glow Effect */}
            <div
              className={`absolute inset-0 opacity-30 blur-md rounded-md
    ${rank === 1
                  ? "bg-yellow-400"
                  : rank <= 3
                    ? "bg-gray-300"
                    : rank <= 5
                      ? "bg-yellow-800"
                      : "bg-purple-500"
                }`}
            ></div>
          </div>

          {/* Semester Dropdown - Moves to the right on large screens, centered on small screens */}
          <div className="flex flex-col items-center md:items-end">
            <label className="block text-sm font-medium text-white mb-1">
              Semester
            </label>
            <Dropdown
              options={semesters}
              onSelect={(selected) => {
                console.log("Setting semester to:", selected);
                setSemester(selected);
              }}
              width="w-25"
              selected={semester}
            />
          </div>
        </div>

      </div>


      {/* Marks Table */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full border border-gray-700 text-white text-sm md:text-base rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-purple-700 to-indigo-700 text-gray-100 text-xs md:text-sm">
              <th className="p-3 border border-gray-600 text-left">Subject</th>
              <th className="p-3 border border-gray-600 text-center">Marks</th>
              <th className="p-3 border border-gray-600 text-center">Scored More Than</th>
              <th className="p-3 border border-gray-600 text-center">Total Students</th>
            </tr>
          </thead>
          <tbody>
            {subjectMarks.length > 0 ? (
              subjectMarks.map((subject, index) => (
                <tr
                  key={index}
                  className="bg-gray-800 hover:bg-gray-900 text-center text-xs md:text-sm  transition duration-200"
                >
                  <td className="p-3 border border-gray-700 text-left font-medium">{subject.name}</td>
                  <td className="p-3 border border-gray-700 font-semibold text-purple-400">{subject.marks}</td>
                  <td className="p-3 border border-gray-700 text-green-400">{subject.scoredMoreThan}</td>
                  <td className="p-3 border border-gray-700">{subject.totalStudents}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-400 italic">
                  No marks data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* Total Marks & Percentage + Performance Insight Section */}
      <div className="flex md:justify-center mt-6 md:gap-12 gap-8 items-center sm:flex-row flex-col">

        {/* Total Marks & Percentage Box */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg sm:w-[200px] w-[250px] text-center transform transition-all duration-300 hover:scale-105">
          <h2 className="text-lg font-semibold">Total Marks</h2>
          <span className="text-xl font-bold text-purple-400">{total_marks || "--"}</span>
          <div className="h-[2px] bg-purple-500 my-2"></div>
          <h2 className="text-lg font-semibold">Percentage</h2>
          <span className="text-xl font-bold text-green-400">{percentage || "--"}%</span>
        </div>

        {/* Performance & Progress Insight Box (Now Smaller) */}
        <div className="p-4 sm:w-[380px] w-[350px] rounded-lg bg-gradient-to-r from-blue-700 to-purple-700 text-white shadow-lg text-center transform transition-all duration-300 hover:scale-105">
          <h2 className="text-lg font-semibold mb-2">Performance & Progress</h2>

          {/* Best & Weakest Subject */}
          <div className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-md mb-2">
            <span className="text-xs font-medium text-gray-300">Best Subject:</span>
            <span className="text-sm font-semibold text-green-400">{bestScoringSubject || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-md mb-3">
            <span className="text-xs font-medium text-gray-300">Needs Improvement:</span>
            <span className="text-sm font-semibold text-red-400">{worstScoringSubject || "N/A"}</span>
          </div>

          {/* Competitor Gap */}
          {rank > 3 && rank <= 10 ? (
            <p className="text-sm text-gray-200">You are <span className="font-bold text-yellow-300">{rank3_tot - total_marks}</span> marks behind Rank #3.</p>
          ) : rank > 10 ? (
            <p className="text-sm text-gray-200">You need <span className="font-bold text-yellow-300">{rank10_tot - total_marks}</span> marks to enter the Top 10.</p>
          ) : rank === 2 || rank === 3 ? (
            <p className="text-sm text-gray-200">You are <span className="font-bold text-yellow-300">{rank1_tot - total_marks}</span> marks behind Rank #1.</p>
          ) : rank === 1 ? (
            <p className="text-sm text-green-300">🔥 You’re at the top! Keep dominating!</p>
          ) : null}
        </div>

      </div>




    </div>


  );
};
