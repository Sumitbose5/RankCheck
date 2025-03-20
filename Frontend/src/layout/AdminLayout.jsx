import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import { MdHelp } from "react-icons/md";
import { useHeader } from "../context/HeaderContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { headerText } = useHeader();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
      <nav className="fixed top-0 left-0 w-full bg-gray-800 p-4 flex justify-between items-center z-50 shadow-lg">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-300 hover:text-white transition-all duration-300 focus:outline-none cursor-pointer"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <h1 className="text-2xl md:text-3xl font-semibold">{headerText}</h1>

        <NavLink to="#" className="text-gray-300 hover:text-white transition">
          <MdHelp size={24} />
        </NavLink>
      </nav>

      {/* Sidebar Dropdown */}
      <aside
        className={`fixed top-16 left-4 md:left-6 bg-gray-800 shadow-xl rounded-lg p-4 w-56 z-50 transition-all duration-300 ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-60 opacity-0"
          }`}
      >
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/admin/marks-control");
              }}
              className="w-full text-left block p-3 bg-gray-700/50 hover:bg-blue-600 rounded-lg transition-all duration-300 cursor-pointer"
            >
              Marks Control
            </button>
          </li>

          <li>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/admin/user-control");
              }}
              className="w-full text-left block p-3 bg-gray-700/50 hover:bg-blue-600 rounded-lg transition-all duration-300 cursor-pointer"
            >
              User Control
            </button>
          </li>

          <li>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/student/dashboard");
              }}
              className="w-full text-left block p-3 bg-gray-700/50 hover:bg-green-600 rounded-lg transition-all duration-300 cursor-pointer"
            >
              Switch to Student
            </button>
          </li>

          <li>
            <button
              className="w-full text-left block cursor-pointer p-3 text-red-400  hover:bg-red-600 hover:text-white rounded-lg transition-all duration-300"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mt-20 p-6 md:p-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 p-4 text-center text-sm">
        &copy; {new Date().getFullYear()} RankCheck. All rights reserved.
      </footer>
    </div>
  );
};
