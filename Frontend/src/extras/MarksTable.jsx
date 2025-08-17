import { useEffect, useState } from "react";

export const MarksTable = () => {
    const [marksData, setMarksData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      // Fetch marks data from API
      fetch("https://rank-check.vercel.app/") // Replace with actual API endpoint
        .then((response) => response.json())
        .then((data) => {
          setMarksData(data.marks); // Assuming API returns { marks: [...] }
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load marks data");
          setLoading(false);
        });
    }, []);
  
    if (loading) return <p className="text-white">Loading...</p>;
    if (error) return <p className="text-red-400">{error}</p>;
  
    return (
      <div className="overflow-x-auto p-4">
        <div className="w-full max-w-full overflow-x-auto">
          <table className="w-full border border-gray-700 text-white text-sm md:text-base">
            <thead>
              <tr className="bg-gray-800 text-xs md:text-sm">
                <th className="p-2 md:p-3 border border-gray-700">Subject Name</th>
                <th className="p-2 md:p-3 border border-gray-700">Marks</th>
                <th className="p-2 md:p-3 border border-gray-700">Scored More Than</th>
                <th className="p-2 md:p-3 border border-gray-700">Total Subjects</th>
              </tr>
            </thead>
            <tbody>
              {marksData.map((subject, index) => (
                <tr key={index} className="bg-gray-900 text-center text-xs md:text-sm">
                  <td className="p-2 md:p-3 border border-gray-700">{subject.name}</td>
                  <td className="p-2 md:p-3 border border-gray-700">{subject.marks}</td>
                  <td className="p-2 md:p-3 border border-gray-700">{subject.scoredMoreThan}%</td>
                  <td className="p-2 md:p-3 border border-gray-700">{marksData.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }