const Marks = require('../models/marks');
const Overall = require('../models/overall');

const calculateOverallMarks = async (req, res) => {
  try {
    const { from, to, semester } = req.body;
    
    for (let rollNo = from; rollNo <= to; rollNo++) {
      const rollNumber = rollNo.toString();
      
      const studentMark = await Marks.findOne({ rollNumber, sem: semester });
      
      if (!studentMark) continue;
      
      const existingOverall = await Overall.findOne({ rollNumber });
      const currentMarks = existingOverall ? parseInt(existingOverall.marks) : 0;
      const newTotalMarks = currentMarks + parseInt(studentMark.total_marks);
      
      await Overall.findOneAndUpdate(
        { rollNumber },
        {
          rollNumber,
          studentName: studentMark.studentName,
          marks: newTotalMarks.toString(),
          rank: 0,
          regyear: studentMark.regyear
        },
        { upsert: true, new: true }
      );
    }
    
    return res.status(200).json({ success: true, message: 'Overall marks calculation completed' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const assignOverallRank = async (req, res) => {
  try {
    const overallMarks = await Overall.find({ regyear: '2023' }).sort({ marks: -1 });

    let currentRank = 1;
    for (let i = 0; i < overallMarks.length; i++) {
      if (i > 0 && parseInt(overallMarks[i].marks) < parseInt(overallMarks[i - 1].marks)) {
        currentRank++;
      }
      await Overall.findOneAndUpdate({ rollNumber: overallMarks[i].rollNumber }, { rank: currentRank });
    }

    console.log('Overall rank assignment completed');
    return res.status(200).json({
        success: true,
        message: "Ranks updated successfully"
    })
  } catch (error) {
    console.error('Error assigning overall rank:', error);
    return res.status(500).json({
        success: false,
        message: error.message
    })
  }
};



const getOverallLeaderboard = async (req, res) => {
  try {
    const { regyear } = req.params;
    let query = Overall.find({ regyear }).sort({ marks: -1 });
    
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    
    query = query.skip(skip).limit(limit);
    
    if (req.query.page) {
      const overallCount = await Overall.countDocuments({ regyear });
      if (skip >= overallCount) {
        return res.status(404).json({
          success: false,
          message: "Page not found!"
        });
      }
    }
    
    const overallMarks = await query;
    
    return res.status(200).json({
      success: true,
      marksLength: overallMarks.length,
      marks: overallMarks,
      message: "Overall marks fetched successfully!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { calculateOverallMarks, assignOverallRank, getOverallLeaderboard };