import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import { MdHelp } from "react-icons/md";
import { useHeader } from "../context/HeaderContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "../context/UserContext";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const ProtectedLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { headerText } = useHeader();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userData } = useUser();

  const userRole = userData?.role;

  // Logout function
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`${VITE_BASE_URL}/auth/logout`, {}, {
        withCredentials: true,
      });
      if (!res.data.success) throw new Error("Logout failed!");
      return res.data;
    },
    onSuccess: () => {
      queryClient.removeQueries(); // Safely remove queries instead of clear()
      localStorage.clear();
      toast.success("Logged out successfully!");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Logout failed!");
    },
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-mono selection:bg-cyan-400 selection:text-black">
      {/* Funky Student Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-zinc-900 p-4 flex justify-between items-center z-50 border-b-4 border-white shadow-[0_4px_0_0_#22c55e]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white text-black border-2 border-black hover:bg-cyan-400 transition-all active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_000] cursor-pointer"
        >
          {isOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
        </button>

        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">
          <span className="bg-cyan-400 text-black px-2 mr-1">Rank</span>
          <span className="text-white">Check</span>
        </h1>

        <NavLink to="#" className="bg-yellow-400 p-2 border-2 border-white hover:rotate-3 transition shadow-[3px_3px_0px_000]">
          <MdHelp size={24} className="text-black" />
        </NavLink>
      </nav>

      {/* Sidebar Dropdown - High Contrast Pop-out */}
      <div className={`fixed top-20 left-4 bg-zinc-900 border-4 border-white shadow-[10px_10px_0px_0px_#22c55e] p-4 w-56 z-50 transition-all duration-300 ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-[120%] opacity-0"
        }`}>
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => { setIsOpen(false); navigate("/student/dashboard"); }}
              className="w-full text-left cursor-pointer block p-3 font-bold uppercase border-2 border-transparent hover:border-white hover:bg-cyan-600 transition-all"
            >
              {">"} Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => { setIsOpen(false); navigate("/student/leaderboard"); }}
              className="w-full text-left cursor-pointer block p-3 font-bold uppercase border-2 border-transparent hover:border-white hover:bg-yellow-500 hover:text-black transition-all"
            >
              {">"} Leaderboard
            </button>
          </li>
          <li>
            <button
              onClick={() => { setIsOpen(false); navigate("/student/compare"); }}
              className="w-full text-left cursor-pointer block p-3 font-bold uppercase border-2 border-transparent hover:border-white hover:bg-pink-600 transition-all"
            >
              {">"} Compare
            </button>
          </li>
          <li>
            <button
              onClick={() => { setIsOpen(false); navigate("/student/overall-marks"); }}
              className="w-full text-left cursor-pointer block p-3 font-bold uppercase border-2 border-transparent hover:border-white hover:bg-indigo-600 transition-all"
            >
              {">"} Overall Marks
            </button>
          </li>

          {/* Switch to Admin - Special Styling */}
          {userRole === "Admin" && (
            <li className="pt-2 border-t-2 border-zinc-700">
              <button
                onClick={() => { setIsOpen(false); navigate("/admin/marks-control"); }}
                className="w-full text-left cursor-pointer block p-3 font-black uppercase bg-white text-black border-2 border-black hover:bg-lime-400 transition-all shadow-[4px_4px_0px_000]"
              >
                Go Admin Mode
              </button>
            </li>
          )}

          <li>
            <button
              className="w-full text-left block cursor-pointer p-3 font-bold uppercase text-red-500 hover:bg-red-600 hover:text-white transition-all"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "EXITING..." : "Logout_"}
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 mt-24 p-6 relative">
        {/* Subtle Background Detail */}
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
          <span className="text-9xl font-black uppercase">STUDENT_HUB</span>
        </div>

        <div className="relative z-10">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t-4 border-white p-6 text-center">
        <p className="font-black uppercase tracking-widest text-sm italic">
          &copy; {new Date().getFullYear()} <span className="bg-white text-black px-1">RankCheck</span> // Keep Grinding.
        </p>
      </footer>
    </div>

  );
};
