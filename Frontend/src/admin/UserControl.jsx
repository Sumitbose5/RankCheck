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
      const res = await fetch(`https://rank-check.vercel.app/user-control/deleteUser/${userId}`, {
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
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by name or roll number"
          className="p-2 rounded w-60 bg-gray-800 text-white focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* <Dropdown options={semesters} onSelect={setSemester} width="w-auto" selected={semester} /> */}
        <button onClick={() => setIsModalOpen(true)} className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition-all cursor-pointer">Filter & Sort</button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2 border border-gray-700">Name</th>
              <th className="p-2 border border-gray-700">Email</th>
              <th className="p-2 border border-gray-700">Role</th>
              <th className="p-2 border border-gray-700">Roll No.</th>
            </tr>
          </thead>
          <tbody>
            {usersArr.length > 0 ? (
              usersArr.map((user) => (
                <tr key={user._id} className="hover:bg-gray-800">
                  <td className="p-2 border border-gray-700">{user.username}</td>
                  <td className="p-2 border border-gray-700">{user.email}</td>
                  <td className="p-2 border border-gray-700">{user.role}</td>
                  <td className="p-2 border border-gray-700">{user.roll_no}</td>
                  <td className="p-2 border border-gray-700 flex justify-center">
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 cursor-pointer"
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setUserID(user._id);
                      }}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-400">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Delete */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
          <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
                // onClick={closeModal}
                onClick={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
                onClick={() => {
                  console.log("User ID inside delete button : ", userID);
                  deleteUser(userID);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl mb-4">Filter & Sort</h2>
            <select className="p-2 w-full mb-2 bg-gray-700 rounded" onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">All Roles</option>
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
            </select>
            {/* <select className="p-2 w-full mb-2 bg-gray-700 rounded" onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select> */}
            <select className="p-2 w-full mb-4 bg-gray-700 rounded" onChange={(e) => setSortBy(e.target.value)}>
              <option value="">Sort By</option>
              <option value="name">Name</option>
              <option value="role">Role</option>
            </select>
            <button onClick={() => setIsModalOpen(false)} className="w-full p-2 bg-red-600 hover:bg-red-700 rounded transition-all cursor-pointer">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}