const express = require("express");
const router = express.Router();

// import middlewares
const { auth, isStudent, isAdmin } = require("../middlewares/auth");

const {login, signup, otpVerification, logout, resetPassword, resetPswdOTP, changePassword} = require("../controllers/authController");


// routes for authentication ------------>
router.get("/", auth, (req, res) => {
    return res.status(200).json({
        success : true,
        role : req.user.role,
        message : "User Verified",
    })
})

router.get("/dashboard", auth, isStudent, (req, res)=>{
    return res.status(200).json({
        role: req.user.role,
        success : true,
        message : "Welcome to Student Dashboard Page"
    });
})

router.get("/admin-panel", auth, isAdmin, (req, res) => {
    return res.status(200).json({
        role: req.user.role,
        success : true,
        message : "Welcome to Admin Dashboard Page"
    });
})



// routes for login, signup, OTP, reset password ---->

router.post("/login", login);
router.post("/signup", signup);
router.post("/verify-otp", otpVerification);
router.post("/reset-pswd", resetPassword);
router.post("/reset-pswd-otp", resetPswdOTP);
router.post("/change-pswd", changePassword);


router.post("/logout", logout); 

module.exports = router;