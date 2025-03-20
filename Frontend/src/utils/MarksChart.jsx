import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const MarksComparisonChart = ({ myMarks, otherMarks, p1, p2 }) => {
  // Prepare data for the chart
  const data = myMarks?.map((subject, index) => ({
    subject: subject.name,
    myMarks: subject.marks,
    otherMarks: otherMarks[index]?.marks || 0, // Handle missing subjects
  }));

  return (
    <div className="bg-gray-800 sm:p-6 p-3 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-center text-white mb-4">Marks Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          {/* <XAxis dataKey="subject" stroke="#ccc" />  */}
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Bar dataKey="myMarks" fill="#4F46E5" name={p1} />
          <Bar dataKey="otherMarks" fill="#E11D48" name={p2} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};


