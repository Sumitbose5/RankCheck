import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import { MdHelp } from "react-icons/md";
import { useHeader } from "../context/HeaderContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "../context/UserContext";

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
      const res = await axios.get("http://localhost:3000/auth/logout", {
        withCredentials: true,
      });
      if (!res.data.success) throw new Error("Logout failed!");
      return res.data;
    },
    onSuccess: () => {
      queryClient.removeQueries(); // Safely remove queries instead of clear()
      toast.success("Logged out successfully!");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Logout failed!");
    },
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gray-800 p-4 flex justify-between items-center z-50 shadow-md">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 cursor-pointer text-gray-300 hover:text-white transition-all duration-300">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent tracking-wide drop-shadow-md">
          {headerText}
        </h1>

        <NavLink to="#" className="text-gray-300 hover:text-white transition-all duration-300">
          <MdHelp size={24} />
        </NavLink>
      </nav>

      {/* Sidebar Dropdown */}
      <div className={`fixed top-16 left-4 bg-gray-800 shadow-lg rounded-lg p-4 w-48 z-50 transition-transform duration-300 ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-60 opacity-0"}`}>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/student/dashboard");
              }}
              className="w-full text-left cursor-pointer block p-3 bg-gray-700/50 hover:bg-purple-600 rounded-lg transition-all duration-300"
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/student/leaderboard");
              }}
              className="w-full text-left cursor-pointer block p-3 bg-gray-700/50 hover:bg-indigo-600 rounded-lg transition-all duration-300"
            >
              Leaderboard
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/student/compare");
              }}
              className="w-full text-left cursor-pointer block p-3 bg-gray-700/50 hover:bg-blue-600 rounded-lg transition-all duration-300"
            >
              Compare
            </button>
          </li>

          {/* Only for Admin */}
          {userRole === "Admin" && (
            <li>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/admin/marks-control");
                }}
                className="w-full text-left cursor-pointer block p-3 bg-gray-700/50 hover:bg-blue-600 rounded-lg transition-all duration-300"
              >
                Switch to Admin
              </button>
            </li>
          )}

          <li>
            <button
              className="w-full text-left block cursor-pointer p-3 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-300"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <main className="flex-1 mt-16 p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 p-4 text-center text-sm opacity-80 border-t border-gray-700">
        &copy; {new Date().getFullYear()} <span className="text-purple-400 font-semibold">RankCheck</span>. All rights reserved.
      </footer>
    </div>

  );
};
