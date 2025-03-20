import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6 text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-xl mt-4 text-gray-300">Data not found</p>
      <p className="text-gray-400 mt-2">The data you are looking for is either not available or temporarily unavailable.</p>
      
      <button 
        onClick={() => navigate("/student/compare")} 
        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 flex items-center gap-2 text-white rounded-md cursor-pointer"
      >
        <ArrowLeft size={20} /> Go Back
      </button>
    </div>
  );
}
