const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Required for form data
app.use(cookieParser());
require("dotenv").config();

const corsOptions = {
    origin: [ "https://rankcheck.netlify.app", "http://localhost:5173" ],
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}

app.use(cors(corsOptions));

// start the server
const PORT = process.env.PORT || 4000;

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

app.listen(PORT, ()=>{
    console.log(`App is listening at PORT ${PORT}`)
})

// connect to DB
const dbConnect = require("./config/db");
dbConnect();

// default route
app.get("/", (req, res) => {
    res.send("Default Route")
})