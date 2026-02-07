import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const Home = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${VITE_BASE_URL}/auth`, {
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
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6 font-mono relative overflow-hidden">

  {/* Background Decorative Element */}
  <div className="absolute inset-0 opacity-5 pointer-events-none select-none overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full border-[1px] border-dashed border-white m-10"></div>
    <span className="text-[15rem] md:text-[20rem] font-black absolute -bottom-20 -right-20 italic">V2.0</span>
  </div>

  {/* THE "FAME" BADGE - Sumit Kumar Bose Signature */}
  <div className="absolute top-10 right-10 z-20 hidden md:block">
    <div className="bg-lime-400 text-black border-4 border-black px-4 py-2 rotate-6 shadow-[6px_6px_0px_0px_#fff] hover:rotate-0 transition-all duration-300">
      <p className="text-[10px] font-black uppercase leading-none">Architect_Of_System</p>
      <p className="text-xl font-black italic tracking-tighter uppercase">Sumit Kumar Bose</p>
    </div>
  </div>

  {/* Main Brand Box */}
  <div className="relative z-10 flex flex-col items-center">
    <div className="bg-white border-4 border-black p-6 md:p-10 shadow-[12px_12px_0px_0px_#3b82f6] -rotate-2 mb-8 group hover:rotate-0 transition-transform">
      <h1 className="text-5xl md:text-9xl font-black text-black uppercase tracking-tighter leading-none italic">
        Rank<span className="text-blue-600">Check</span>
      </h1>
    </div>

    {/* Batch Info Tag */}
    <div className="bg-zinc-900 border-2 border-dashed border-zinc-700 px-4 py-2 mb-12 flex items-center gap-3">
      <div className="h-2 w-2 bg-lime-400 animate-pulse rounded-full"></div>
      <p className="text-xs md:text-sm font-bold text-zinc-400 uppercase tracking-[0.3em]">
        KCC_BCA_BATCH_2023-27
      </p>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xs sm:max-w-none justify-center">
      <button 
        className="group relative bg-blue-600 text-white font-black uppercase tracking-widest py-5 px-12 border-4 border-black shadow-[8px_8px_0px_000] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all cursor-pointer text-xl"
        onClick={() => navigate('/login')}
      >
        <span className="relative z-10">Enter_System</span>
      </button>

      <button 
        className="bg-zinc-800 text-white font-black uppercase tracking-widest py-5 px-12 border-4 border-white shadow-[8px_8px_0px_0px_#ec4899] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all cursor-pointer text-xl"
        onClick={() => navigate('/signup')}
      >
        Signup_
      </button>
    </div>

    {/* Mobile Creator Credit - Visible only on small screens */}
    <div className="mt-16 md:hidden">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2 text-center underline decoration-lime-400 underline-offset-4">
            Built By Sumit Kumar Bose
        </p>
    </div>
  </div>

  {/* Refined Footer */}
  <footer className="absolute bottom-10 w-full text-center hidden md:block">
    <div className="flex justify-center items-center gap-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
      <span>HANDCRAFTED_IN_JAMSHEDPUR</span>
      <span className="h-1 w-1 bg-zinc-600 rounded-full"></span>
      <span>2026_VERSION</span>
    </div>
  </footer>
</div>
  );

}
