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
    <div className="p-4 sm:p-6 font-mono text-white bg-zinc-950 min-h-screen">
  {/* Welcome Section - Responsive Text Scaling */}
  <div className="flex justify-start items-center pb-6">
    <h1 className="text-xl xs:text-2xl sm:text-4xl font-black uppercase tracking-tighter leading-tight">
      HELL_O, <br className="sm:hidden" />
      <span className="bg-cyan-400 text-black px-2 italic">{userData?.userInfo || "STUDENT"}</span> 👋
    </h1>
  </div>

  {/* Header Section: Semester Marks + Rank + Dropdown */}
  <div className="border-4 border-white bg-zinc-900 p-4 sm:p-6 mb-8 shadow-[6px_6px_0px_0px_rgba(34,197,94,1)] sm:shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
    
    <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight border-b-4 border-lime-400 lg:border-none">
      Marks_Log
    </h1>

    {/* Controls Wrapper - Stacks on mobile, Rows on Desktop */}
    <div className="flex flex-col sm:flex-row justify-start lg:justify-end items-stretch sm:items-end gap-4 sm:gap-6 w-full lg:w-auto">
      
      {/* Dynamic Rank Box - Full width on tiny screens */}
      <div className={`p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] w-full sm:w-[140px] text-center transition-transform hover:-rotate-2
        ${rank === 1 ? "bg-yellow-400 text-black" : 
          rank <= 3 ? "bg-zinc-200 text-black" : 
          "bg-violet-600 text-white"}`}
      >
        <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-widest leading-none mb-1">Current_Rank</h2>
        <span className="text-2xl sm:text-3xl font-black">#{rank || "N/A"}</span>
      </div>

      {/* Semester Dropdown - Full width on tiny screens */}
      <div className="flex flex-col items-start w-full sm:min-w-[160px]">
        <label className="text-[10px] font-black uppercase mb-1 text-cyan-400">Select_Sem</label>
        <div className="border-4 border-white bg-zinc-800 w-full">
          <Dropdown
            options={semesters}
            onSelect={(selected) => setSemester(selected)}
            width="w-full"
            selected={semester}
          />
        </div>
      </div>
    </div>
  </div>

  {/* Marks Table Section - Improved Mobile Scroll */}
<div className="relative group">
  {/* Mobile Scroll Indicator */}
  <div className="sm:hidden text-[10px] font-black text-pink-500 uppercase mb-1 animate-pulse">
    ← Swipe Table →
  </div>
  
  <div className="overflow-x-auto border-4 border-white shadow-[6px_6px_0px_0px_#ec4899] sm:shadow-[10px_10px_0px_0px_#ec4899] mb-10">
    {/* I adjusted the min-width to ensure the Beat % column has space to breathe on mobile */}
    <table className="w-full text-left border-collapse min-w-[450px] sm:min-w-full">
      <thead>
        <tr className="bg-white text-black border-b-4 border-white">
          <th className="p-3 sm:p-4 font-black uppercase italic text-xs sm:text-base">Subject</th>
          <th className="p-3 sm:p-4 font-black uppercase text-center text-xs sm:text-base">Marks</th>
          {/* REMOVED: hidden md:table-cell. ADDED: text-[10px] for tiny screens */}
          <th className="p-3 sm:p-4 font-black uppercase text-center text-[10px] sm:text-base">Beat %</th>
          <th className="p-3 sm:p-4 font-black uppercase text-center text-xs sm:text-base">Total</th>
        </tr>
      </thead>
      <tbody className="bg-zinc-900">
        {subjectMarks.length > 0 ? (
          subjectMarks.map((subject, index) => (
            <tr key={index} className="border-b-2 border-zinc-800 active:bg-zinc-800 transition-colors">
              <td className="p-3 sm:p-4 font-bold text-cyan-400 uppercase text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">
                {subject.name}
              </td>
              <td className="p-3 sm:p-4 text-center font-black text-xl sm:text-2xl italic">
                {subject.marks}
              </td>
              {/* REMOVED: hidden md:table-cell. Added text-green-400 for pop */}
              <td className="p-3 sm:p-4 text-center text-green-400 font-black text-xs sm:text-lg">
                {subject.scoredMoreThan} 
              </td>
              <td className="p-3 sm:p-4 text-center font-bold text-zinc-500 text-xs sm:text-base">
                {subject.totalStudents}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="p-10 text-center font-black uppercase text-zinc-600 italic text-sm">
              -- NO_DATA_FOUND --
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

  {/* Stats Footer Section - Grid stacks on mobile */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

    {/* Total & Percentage Card */}
    <div className="p-4 sm:p-6 bg-white text-black border-4 border-black shadow-[6px_6px_0px_0px_#22c55e] sm:shadow-[8px_8px_0px_0px_#22c55e]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter">Aggregate</h2>
        <span className="text-[10px] font-black bg-black text-white px-2 py-1">FINAL</span>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] sm:text-sm font-bold uppercase text-zinc-600 underline">Total</p>
          <p className="text-3xl sm:text-4xl font-black">{total_marks || "--"}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] sm:text-sm font-bold uppercase text-zinc-600 underline">Percentage</p>
          <p className="text-3xl sm:text-4xl font-black text-violet-600">{percentage || "--"}%</p>
        </div>
      </div>
    </div>

    {/* Performance Insight Card */}
    <div className="p-4 sm:p-6 bg-zinc-900 border-4 border-white shadow-[6px_6px_0px_0px_#eab308] sm:shadow-[8px_8px_0px_0px_#eab308]">
      <h2 className="text-lg sm:text-xl font-black uppercase mb-4 italic text-yellow-400 tracking-tighter">Insights</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between border-b-2 border-zinc-800 pb-1">
          <span className="font-bold text-zinc-500 uppercase text-[10px] sm:text-xs">Best_Score:</span>
          <span className="font-black text-green-400 uppercase text-xs sm:text-sm">{bestScoringSubject || "N/A"}</span>
        </div>
        <div className="flex justify-between border-b-2 border-zinc-800 pb-1">
          <span className="font-bold text-zinc-500 uppercase text-[10px] sm:text-xs">Weak_Link:</span>
          <span className="font-black text-red-500 uppercase text-xs sm:text-sm">{worstScoringSubject || "N/A"}</span>
        </div>
      </div>

      <div className="bg-zinc-800 p-3 border-2 border-dashed border-zinc-600">
        {rank === 1 ? (
          <p className="text-xs sm:text-sm font-black text-yellow-400">🏆 TOP_TIER_ACHIEVED.</p>
        ) : (
          <p className="text-[10px] sm:text-xs font-bold leading-relaxed">
            GOAL: <span className="text-white bg-pink-600 px-1 ml-1 font-black">
              {rank <= 3 ? (rank1_tot - total_marks) : (rank3_tot - total_marks)} PTS TO LEVEL UP
            </span>
          </p>
        )}
      </div>
    </div>
  </div>
</div>

  );
};
