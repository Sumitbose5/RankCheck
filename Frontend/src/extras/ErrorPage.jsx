import { useNavigate } from "react-router-dom";

export const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <img 
        src="https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif" 
        alt="Error GIF"
        className="w-64 md:w-80 rounded-lg shadow-lg"
      />
      
      <h1 className="text-3xl font-bold mt-6">Oops! Something Went Wrong</h1>
      <p className="text-gray-400 mt-2 text-center px-4">
        We couldn't find the page you were looking for.
      </p>

      <button 
        onClick={() => navigate(-1)}
        className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 
                   hover:from-purple-600 hover:to-blue-500 transition-all 
                   text-white font-semibold text-lg shadow-md transform hover:scale-105"
      >
        <span className="text-xl">⬅️</span> Go Back
      </button>
    </div>
  );
};

