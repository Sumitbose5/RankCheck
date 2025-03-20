const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username : { type : String, required: true},
    email : { type : String, required: true },
    password : { type : String, required: true },
    roll_no : { type : String, required: true },
    regno : { type: String },
    sem : { type: String, },
    dob : { type: String, },
    class_name: {type : String},
    marks: [{  // Reference to marks model
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Marks", 
    }], 
    role : {
        type : String,
        enum : ["Admin", "Student", "Visitor"],
        default : "Visitor",
    },
    createdAt : { type: Date, default: Date.now() },
})

module.exports = mongoose.model("User", userSchema);