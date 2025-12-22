import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-white p-4">
      <h1 className="font-press-start-2p text-3xl md:text-5xl mb-4 text-center text-blue-500">RankCheck</h1>
      <p className="text-sm md:text-base text-gray-400 mb-8 text-center font-mono">Made for KCC BCA Batch 2023-27</p>

      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition duration-300 cursor-pointer"
        onClick={() => navigate('/login')}>
        Login
      </button>
    </div>
  );

}
