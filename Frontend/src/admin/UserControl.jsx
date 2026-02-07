import { useEffect, useRef, useState } from "react";
import { Dropdown } from "../extras/Dropdown";
import { useHeader } from "../context/HeaderContext";
import { MdDelete } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "../extras/Spinner";
import { fetchUserData } from "../utils/FetchUserData";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";

const usersData = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Student", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Suspended" },
  { id: 3, name: "Alice Brown", email: "alice@example.com", role: "Student", status: "Active" },
];

const semesters = ["All Semesters", "Semester 1", "Semester 2", "Semester 3"];
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const UserControl = () => {
  const [users, setUsers] = useState(usersData);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [semester, setSemester] = useState("All Semesters");
  const { setHeaderText } = useHeader();
  const [pageNumber, setPageNumber] = useState(1);
  const inputRef = useRef(null); // Reference to the search input field
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Debounced state
  const [userID, setUserID] = useState("");
  const queryClient = useQueryClient();

  // Debounce the search input (updates `debouncedSearch` after 500ms of inactivity)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler); // Cleanup timeout on re-render
  }, [search]);

  useEffect(() => {
    setHeaderText("User Control");
  }, [setHeaderText]);

  // Fetch user data (triggers only when `debouncedSearch` updates)
  const { data, isPending, isError, error, isSuccess } = useQuery({
    queryKey: ["usr_data", debouncedSearch],
    queryFn: () => fetchUserData(pageNumber, debouncedSearch),
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  })


  // Delete user API function
  const deleteUser = async (userId) => {
    try {
      const res = await fetch(`${VITE_BASE_URL}/user-control/deleteUser/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Error while deleting user");
      }
      setIsDeleteModalOpen(false);
      toast.success("User Deleted Successfully");

      // ✅ Trigger re-fetching of users data
      queryClient.invalidateQueries(["users"]);
    } catch (error) {
      toast.error("Error while deleting user");
    }
  };

  if (isPending) return <Spinner />;
  if (isError) return <p className="text-red-400">Data not found! {error}</p>;

  const usersArr = data?.users;
  // console.log("User Array : ", usersArr);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6 flex flex-col gap-6 font-mono">

      {/* Header Controls - Responsive Stack */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch md:items-center justify-between bg-zinc-900 border-4 border-white p-4 shadow-[6px_6px_0px_0px_rgba(34,211,238,1)] sm:shadow-[8px_8px_0px_0px_rgba(34,211,238,1)]">
        <div className="relative w-full md:w-auto">
          <span className="absolute -top-3 left-2 bg-cyan-400 text-black text-[10px] font-black px-2 border-2 border-black uppercase z-10">
            Search_Query
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="NAME_OR_ROLL..."
            className="p-3 w-full md:w-80 bg-zinc-800 border-2 border-white text-white focus:outline-none focus:border-cyan-400 font-bold placeholder:text-zinc-600 text-sm sm:text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-6 py-3 bg-white text-black font-black uppercase tracking-widest border-4 border-black shadow-[4px_4px_0px_000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer text-sm sm:text-base"
        >
          Filter_&_Sort
        </button>
      </div>

      {/* Table Section - Optimized for Mobile Swipe */}
      <div className="relative">
        <div className="sm:hidden text-[10px] font-black text-cyan-400 uppercase mb-1 animate-pulse text-center">
          ← Swipe Registry →
        </div>

        <div className="overflow-x-auto border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] sm:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)]">
          <table className="w-full border-collapse min-w-[600px] sm:min-w-full">
            <thead>
              <tr className="bg-white text-black">
                <th className="p-3 sm:p-4 border-2 border-black font-black uppercase text-left italic text-xs sm:text-sm">User_Handle</th>
                <th className="p-3 sm:p-4 border-2 border-black font-black uppercase text-left text-xs sm:text-sm">Comm_Link</th>
                <th className="p-3 sm:p-4 border-2 border-black font-black uppercase text-left text-xs sm:text-sm">Role</th>
                <th className="p-3 sm:p-4 border-2 border-black font-black uppercase text-left text-xs sm:text-sm">ID</th>
                <th className="p-3 sm:p-4 border-2 border-black font-black uppercase text-center text-xs sm:text-sm">Action</th>
              </tr>
            </thead>
            <tbody className="bg-zinc-900">
              {usersArr.length > 0 ? (
                usersArr.map((user) => (
                  <tr key={user._id} className="active:bg-zinc-800 border-b-2 border-zinc-800 transition-colors">
                    <td className="p-3 sm:p-4 font-bold text-cyan-400 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                      {user.username}
                    </td>
                    <td className="p-3 sm:p-4 text-zinc-400 text-[10px] sm:text-sm truncate max-w-[150px] sm:max-w-none">
                      {user.email}
                    </td>
                    <td className="p-3 sm:p-4">
                      <span className={`px-2 py-0.5 font-black text-[10px] uppercase border-2 ${user.role === 'Admin' ? 'bg-pink-600 border-white text-white' : 'bg-zinc-700 border-zinc-500 text-zinc-300'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 font-mono text-[10px] sm:text-sm">{user.roll_no}</td>
                    <td className="p-3 sm:p-4 flex justify-center">
                      <button
                        className="bg-red-500 text-white p-2 border-2 border-black shadow-[3px_3px_0px_000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setUserID(user._id);
                        }}
                      >
                        <MdDelete size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-zinc-600 font-black uppercase italic tracking-widest text-xs sm:text-sm">
                    [!] NO_DATA_FOUND
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal - Responsive Sizing */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-900 border-4 border-red-600 p-6 sm:p-8 shadow-[8px_8px_0px_0px_#dc2626] w-full max-w-xs sm:max-w-sm text-center">
            <h2 className="text-xl sm:text-2xl font-black text-red-500 uppercase italic mb-4">CRITICAL_PURGE!</h2>
            <p className="font-bold text-zinc-300 mb-8 uppercase text-[10px] sm:text-xs tracking-tighter">
              Confirm permanent removal of this entity from the registry.
            </p>
            <div className="flex flex-col gap-3">
              <button
                className="w-full bg-red-600 text-white py-3 font-black uppercase border-2 border-black shadow-[4px_4px_0px_000] active:shadow-none active:translate-x-1 active:translate-y-1"
                onClick={() => deleteUser(userID)}
              >
                CONFIRM_DELETE
              </button>
              <button
                className="w-full bg-zinc-700 text-white py-2 font-black uppercase border-2 border-black"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                ABORT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal - Mobile Adjustments */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white border-[4px] sm:border-[6px] border-black p-6 sm:p-8 shadow-[10px_10px_0px_0px_#8b5cf6] w-full max-w-md">
            <div className="absolute -top-4 -left-2 bg-lime-400 text-black px-2 py-1 font-black uppercase text-[10px] border-2 border-black -rotate-3 shadow-[2px_2px_0px_000]">
              PARAMS
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-black uppercase italic mb-6 border-b-4 border-black inline-block">Filters</h2>

            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">System_Role</label>
                <select className="p-3 w-full bg-zinc-100 border-4 border-black font-black uppercase text-xs" onChange={(e) => setRoleFilter(e.target.value)}>
                  <option value="">All Roles</option>
                  <option value="Student">Student</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Order_By</label>
                <select className="p-3 w-full bg-zinc-100 border-4 border-black font-black uppercase text-xs" onChange={(e) => setSortBy(e.target.value)}>
                  <option value="">Default</option>
                  <option value="name">Name</option>
                  <option value="role">Role</option>
                </select>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full p-4 bg-violet-600 text-white font-black uppercase tracking-widest border-4 border-black shadow-[4px_4px_0px_000] active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                Apply_Params
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}