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
    <div className="flex justify-center items-center h-120">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 w-96 text-center border border-gray-300 dark:border-gray-700">
        <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium italic">
          We don’t promote comparison, but this feature helps you track progress.
        </p>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 shadow-md ${mode === "self" ? "bg-purple-600 text-white shadow-lg" : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:bg-purple-500 hover:text-white"}`}
            onClick={() => setMode("self")}
          >
            Yourself vs Others
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 shadow-md ${mode === "others" ? "bg-purple-600 text-white shadow-lg" : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:bg-purple-500 hover:text-white"}`}
            onClick={() => setMode("others")}
          >
            Others vs Others
          </button>
        </div>

        {/* Semester Selection */}
        <div className="mb-4 flex flex-col items-center">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Semester:
          </label>
          <Dropdown options={semesters} onSelect={setSemester} selected={semester} width="w-25" />
        </div>

        {/* Input Fields */}
        <div className="space-y-3">
          {mode === "self" ? (
            <input
              type="text"
              onChange={(e) => setOther(e.target.value)}
              value={other}
              required
              placeholder="Enter classmate username or Roll No."
              className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          ) : (
            <>
              <input
                type="text"
                onChange={(e) => sets1(e.target.value)}
                value={s1}
                required
                placeholder="Username or Roll No"
                className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <input
                type="text"
                onChange={(e) => sets2(e.target.value)}
                value={s2}
                required
                placeholder="Username or Roll No"
                className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </>
          )}
        </div>

        {/* Compare Button */}
        <button className="mt-4 w-full bg-purple-600 cursor-pointer text-white px-4 py-2 rounded-md shadow-md hover:bg-purple-700 transition-all duration-300 font-semibold"
          onClick={mode === "self" ? handleCompareYouVSOther : handleCompareOtherVSOther}>
          Compare
        </button>
      </div>
    </div>

  );
}
