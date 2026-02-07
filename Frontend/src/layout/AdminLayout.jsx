import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import { MdHelp } from "react-icons/md";
import { useHeader } from "../context/HeaderContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { headerText } = useHeader();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-mono selection:bg-pink-500 selection:text-white">
      {/* Funky Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-zinc-900 p-4 flex justify-between items-center z-50 border-b-4 border-white shadow-[0_4px_0_0_#8b5cf6]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white text-black border-2 border-black hover:bg-lime-400 transition-all active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_000] cursor-pointer"
        >
          {isOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
        </button>

        <h1 className="text-xl md:text-3xl font-black uppercase tracking-tighter italic">
          {headerText} <span className="text-lime-400">.ADMIN</span>
        </h1>

        <NavLink to="#" className="bg-pink-500 p-2 border-2 border-white hover:bg-pink-400 transition shadow-[3px_3px_0px_000]">
          <MdHelp size={24} className="text-white" />
        </NavLink>
      </nav>

      {/* Sidebar - Neo-Brutalist Pop-out */}
      <aside
        className={`fixed top-20 left-4 bg-zinc-900 border-4 border-white shadow-[10px_10px_0px_0px_#ec4899] p-4 w-64 z-50 transition-all duration-300 ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-[120%] opacity-0"
        }`}
      >
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => { setIsOpen(false); navigate("/admin/marks-control"); }}
              className="w-full text-left block p-3 font-black uppercase border-2 border-transparent hover:border-white hover:bg-violet-600 transition-all cursor-pointer"
            >
              [01] Marks Control
            </button>
          </li>

          <li>
            <button
              onClick={() => { setIsOpen(false); navigate("/admin/user-control"); }}
              className="w-full text-left block p-3 font-black uppercase border-2 border-transparent hover:border-white hover:bg-cyan-500 transition-all cursor-pointer"
            >
              [02] User Control
            </button>
          </li>

          <li className="pt-4 border-t-2 border-zinc-700">
            <button
              onClick={() => { setIsOpen(false); navigate("/student/dashboard"); }}
              className="w-full text-left block p-3 font-black uppercase bg-lime-400 text-black border-2 border-black hover:bg-white transition-all cursor-pointer shadow-[4px_4px_0px_000]"
            >
              Switch to Student
            </button>
          </li>

          <li>
            <button
              className="w-full text-left block p-3 font-black uppercase text-red-500 hover:text-white hover:bg-red-600 transition-all cursor-pointer"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "KILL_SESSION..." : "System_Logout"}
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mt-24 p-6 md:p-5">
        <div className="border-2 border-dashed border-zinc-700 p-4 min-h-full">
            <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t-4 border-white p-6 text-center font-black uppercase tracking-widest text-zinc-500">
        &copy; {new Date().getFullYear()} RankCheck // Build_v2.0
      </footer>
    </div>
  );
};
