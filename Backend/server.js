const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// Middleware for JSON & URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Configuration
const corsOptions = {
    // origin: ["https://rankcheck.netlify.app", "http://localhost:5173"],
    origin : "https://rankcheck.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"]
};

// Apply CORS before routes
app.use(cors(corsOptions));

// Manually set CORS headers for all responses
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "https://rankcheck.netlify.app");
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, HEAD");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     next();
// });

// Enable CORS preflight requests
// app.options("*", cors(corsOptions));

// Connect to Database
const dbConnect = require("./config/db");
dbConnect();

// Routes
const authRoute = require("./routes/authRoutes");
app.use("/auth", authRoute);

const studentRoute = require("./routes/studentRoutes");
app.use("/student", studentRoute);

const rankRoute = require("./routes/rankRoutes");
app.use("/leaderboard", rankRoute);

const compareRoute = require("./routes/compareRoutes");
app.use("/compare", compareRoute);

const userControlRoute = require("./routes/userRoutes");
app.use("/user-control", userControlRoute);

// Default Route
app.get("/", (req, res) => {
    res.send("Default Route");
});

app.get("/dep-test", (req, res) => {
    res.send("Hey there i am here!")
})

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`App is listening at PORT ${PORT}`);
});
