const mongoose = require('mongoose');
 
const overallMarksSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true },  // To link marks to a student
    studentName: { type: String, required: true },
    marks: { type: String, required: true },  // Total Marks Obtained
    rank: { type: Number, required: true },  // Overall Rank
    regyear: {type: String, required: true},
    updatedAt: { type: Date, default: Date.now } // Timestamp for tracking updates
  });

module.exports = mongoose.model("Overall", overallMarksSchema);