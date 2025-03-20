const mongoose = require('mongoose');
 
const MarksSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true },  // To link marks to a student
    studentName: { type: String, required: true },
    sem: { type: String, required: true },  // Storing semester as String
    total_marks: { type: String, required: true },
    dob: { type: String, required: true },
    rank : { type : Number, default: 0 }, // holds rank for a single semester 
    regyear: {type: String, required: true},
    regno: {type: String },
    class_name: { type: String, required: true },
    subjects: [
      {
        name: { type: String, required: true },  // Subject Name
        subjectCode : { type : String, required: true},
        marks: { type: String, required: true },  // Marks Obtained
        scoredMoreThan: { type: Number, },
        totalStudents: { type: Number, },
      }
    ],
    updatedAt: { type: Date, default: Date.now } // Timestamp for tracking updates
  });


module.exports = mongoose.model("Marks", MarksSchema);