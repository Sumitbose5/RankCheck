import { useEffect } from "react";
import { IoMdArrowForward } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const Home = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("https://rank-check.vercel.app/auth", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        console.log("data role in home : ", data.role);

        if (data.success) {
          if (data.role === "Student") {
            navigate("/student/dashboard")
          }
          else if (data.role === "Admin") {
            navigate("/admin/marks-control");
          }
          else {
            toast.error("Something went wrong!");
            navigate("/login");
          }
        }
      } catch (err) {
        console.log("Error in check auth home page", err)
      }
    }

    checkAuth();
  }, [])

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#121212] text-white px-6">

      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center py-6">
        <h1 className="text-3xl font-semibold italic">RankCheck</h1>
        <NavLink
          to="/login"
          className="bg-white text-black py-2 px-4 rounded-lg font-semibold transition hover:bg-gray-300">
          Login
        </NavLink>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center w-full flex-1">
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">

          {/* RankCheck Box */}
          <div className="bg-[#1E1E1E] rounded-lg p-6 shadow-lg">
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
              See Where You Stand – Compare Your Semester Marks!
            </h1>
            <p className="italic mt-3 text-gray-300">
              Analyze Your Growth, Compare with Peers, Dominate the Leaderboard! 🏅
            </p>
            <NavLink
              to="/signup"
              className="mt-6 flex items-center justify-center bg-white text-black py-3 px-5 rounded-lg font-medium transition hover:bg-gray-300 w-max">
              <span className="mr-2">Explore RankCheck</span> <IoMdArrowForward />
            </NavLink>
          </div>

          {/* ScoreStack Box */}
          <div className="bg-[#1E1E1E] rounded-lg p-6 shadow-lg">
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
              Go Beyond Ranks – ScoreStack Awaits!
            </h1>
            <p className="italic mt-3 text-gray-300">
              Boost your knowledge, earn points, track your progress, compete with peers, and level up! 🔥
            </p>


            <NavLink
              to="/"
              className="mt-6 flex items-center justify-center px-6 py-3 rounded-lg font-semibold w-max 
             text-gray-300 bg-[#252525] shadow-md border border-gray-600
             hover:bg-[#303030] hover:border-gray-500 transition-all duration-300 relative overflow-hidden"
            >
              <span className="mr-2 text-lg tracking-wide text-gray-400">🚀 Coming Soon...</span>
              {/* <IoMdArrowForward className="text-gray-500 group-hover:text-gray-300 transition-all duration-300" /> */}

              {/* Subtle glowing animation */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-10 animate-slide" />

              <style>
                {`
                  @keyframes slide {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                  }
                  .animate-slide {
                    animation: slide 2.5s infinite linear;
                  }
                `}
              </style>
            </NavLink>


          </div>

        </div>
      </div>
    </div>
  );

}
