import { useEffect, useState } from "react";
import { Dropdown } from "../extras/Dropdown";
import { useHeader } from "../context/HeaderContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUser } from "../context/UserContext";

const semesters = ["I", "II", "III", "IV", "V", "VI"];

export const Compare = () => {
  const [mode, setMode] = useState("self");
  const [semester, setSemester] = useState("I"); // Default semester
  const { setHeaderText } = useHeader();
  const [other, setOther] = useState("");
  const [s1, sets1] = useState("");
  const [s2, sets2] = useState("");
  const navigate = useNavigate();
  const { userData } = useUser();


  // Updates the header text
  useEffect(() => {
    setHeaderText("Compare");  // Update header when mounted
  }, [setHeaderText]);


  const handleCompareYouVSOther = () => {
    if (!other.trim()) {
      toast.error("Enter valid data!");
      return;
    }
    const comparisonData = {
      student1: userData?.userInfo,
      student2: other,
      sem: semester
    }
    localStorage.setItem("compare1", JSON.stringify(comparisonData));
    navigate("/student/compare-result");
  }

  // We can't compare with those who have not registered yet
  const handleCompareOtherVSOther = () => {
    if (!s1.trim() || !s2.trim()) {
      toast.error("Enter valid data!")
      return;
    }
    const comparisonData = {
      student1: s1,
      student2: s2,
      sem: semester
    }
    localStorage.setItem("compare1", JSON.stringify(comparisonData));
    navigate("/student/compare-result");
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] font-mono p-4">
      <div className="bg-zinc-900 border-4 border-white shadow-[16px_16px_0px_0px_#8b5cf6] p-8 w-full max-w-md text-center relative overflow-hidden">

        {/* Decorative Tag */}
        <div className="absolute -right-12 top-6 bg-yellow-400 text-black px-12 py-1 font-black uppercase tracking-tighter rotate-45 text-xs border-2 border-black">
          BATTLE_MODE
        </div>

        <p className="text-zinc-400 mb-6 font-bold italic text-xs uppercase tracking-widest leading-tight">
      // Tracker: Progress  Comparison //
        </p>

        {/* Toggle Buttons - Neo-Brutalist Style */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
          <button
            className={`px-4 py-2 border-2 border-black font-black uppercase tracking-tighter transition-all shadow-[4px_4px_0px_000] active:shadow-none active:translate-x-1 active:translate-y-1 ${mode === "self"
                ? "bg-cyan-400 text-black"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            onClick={() => setMode("self")}
          >
            ME vs THEM
          </button>
          <button
            className={`px-4 py-2 border-2 border-black font-black uppercase tracking-tighter transition-all shadow-[4px_4px_0px_000] active:shadow-none active:translate-x-1 active:translate-y-1 ${mode === "others"
                ? "bg-pink-500 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            onClick={() => setMode("others")}
          >
            THEM vs THEM
          </button>
        </div>

        {/* Semester Selection */}
        <div className="mb-8 flex flex-col items-center">
          <label className="block text-xs font-black text-violet-400 uppercase mb-2 italic">
            Select_Target_Semester:
          </label>
          <div className="border-4 border-white bg-zinc-800">
            <Dropdown options={semesters} onSelect={setSemester} selected={semester} width="w-32" />
          </div>
        </div>

        {/* Input Fields - Chunky Style */}
        <div className="space-y-4 relative">
          {mode === "self" ? (
            <div className="group">
              <span className="block text-left text-[10px] font-black text-zinc-500 ml-1 mb-1">OPPONENT_ID</span>
              <input
                type="text"
                onChange={(e) => setOther(e.target.value)}
                value={other}
                required
                placeholder="Username / Roll No."
                className="border-4 border-white bg-zinc-800 text-white font-black px-4 py-3 w-full focus:bg-zinc-700 focus:border-cyan-400 outline-none placeholder:text-zinc-600 transition-all"
              />
            </div>
          ) : (
            <div className="space-y-6 relative">
              <input
                type="text"
                onChange={(e) => sets1(e.target.value)}
                value={s1}
                required
                placeholder="P1 Username/Roll"
                className="border-4 border-white bg-zinc-800 text-white font-black px-4 py-3 w-full focus:border-pink-500 outline-none transition-all"
              />
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 z-10 bg-white text-black font-black px-2 py-1 border-2 border-black italic text-sm">
                VS
              </div>
              <input
                type="text"
                onChange={(e) => sets2(e.target.value)}
                value={s2}
                required
                placeholder="P2 Username/Roll"
                className="border-4 border-white bg-zinc-800 text-white font-black px-4 py-3 w-full focus:border-pink-500 outline-none transition-all"
              />
            </div>
          )}
        </div>

        {/* Compare Button */}
        <button
          className="mt-10 w-full bg-lime-400 text-black px-4 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-black uppercase tracking-widest text-xl cursor-pointer"
          onClick={mode === "self" ? handleCompareYouVSOther : handleCompareOtherVSOther}>
          INITIATE_VERSUS
        </button>
      </div>
    </div>

  );
}
