const User = require("../models/user");
const { sendmail, verifyOTP } = require("../utils/otp");
const { generateTokenAndSetCookie } = require("../utils/token");
const redis = require("../config/redisClient");
const bcrypt = require("bcrypt");
const Marks = require("../models/marks")


require("dotenv").config();

exports.login = async (req, res) => {
    try {
        // make it one (username or email)
        // set it as data from the user, take the input as data from the user and then find it in the user model
        const { data, password } = req.body; // Fetch email from the request

        if (!data) {
            return res.status(400).json({ success: false, message: "Email/Username is required" });
        }

        // Check if user exists
        const user = await User.findOne({
            $or: [{ email: data }, { username: data }]
        });


        // if not exists
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found, register now" });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // generate token
            generateTokenAndSetCookie(user, res);

            // console.log("Inside OTP verification, res.cookie:", req.cookies);
            const username = user.username;
            const class_name = user.class_name;

            // Redirect based on role
            if (user.role === "Admin") {
                return res.status(200).json({
                    success: true,
                    username,
                    class_name,
                    message: "You are allowed to access the Admin Panel",
                    role: "Admin",
                    user,
                });
            } else if (user.role === "Student") {
                return res.status(200).json({
                    success: true,
                    username,
                    class_name,
                    message: "You are allowed to access the Student Panel",
                    role: "Student",
                    user,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Role not recognized"
                });
            }
        } else {
            return res.status(401).json({ success: false, message: "Incorrect Password" })
        }

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, message: "Error in login" });
    }
}; 



// route handler for otp verification  ("/verify-otp")
exports.otpVerification = async (req, res) => {
    try {
        const { inputOtp, email } = req.body;
        console.log("Email in OTP Verification:", email);

        // Fetch OTP from Redis (per-user storage)
        const OTP = await redis.get(`user:${email}:otp`);

        // Check if OTP exists
        if (!OTP) {
            return res.status(400).json({ success: false, message: "OTP expired or not found. Request a new OTP." });
        }

        // Validate OTP 
        const isValid = await verifyOTP(OTP, inputOtp);
        if (!isValid) {
            return res.status(401).json({ success: false, message: "Incorrect OTP, try again" });
        }

        // OTP is valid, fetch user function type from Redis
        const ftype = await redis.get(`user:${email}:function_name`);
        const username = await redis.get(`user:${email}:username`);
        const roll_no = await redis.get(`user:${email}:roll_no`);
        const password = await redis.get(`user:${email}:password`);

        // hash the password before adding the user to the DB
        const hashedPassword = await bcrypt.hash(password, 10);

        if (ftype === "signup") {
            // Create a new user and save to DB
            const newUser = new User({
                email: email,
                username: username,
                roll_no: roll_no,
                password: hashedPassword,
                role: "Student"
            });

            await newUser.save();
        }

        // Remove OTP and temporary cache keys for this user
        await redis.del(`user:${email}:otp`);
        await redis.del(`user:${email}:otp_requested`); // Allow new OTP requests after verification
        await redis.del(`user:${email}:function_name`);
        await redis.del(`user:${email}:username`);
        await redis.del(`user:${email}:roll_no`);
        await redis.del(`user:${email}:password`);

        // Fetch user from DB
        const user = await User.findOne({ email });

        // Generate token and set it in cookies
        generateTokenAndSetCookie(user, res);

        console.log("Inside OTP verification, res.cookie:", req.cookies);
        const nameOfUser = user.username;
        const role = "Student";

        // Redirect based on role 
        if (user.role === "Admin") {
            return res.status(200).json({
                success: true,
                nameOfUser,
                role,
                message: "You are allowed to access the Admin Panel",
                role: "Admin",
                user,
            });
        } else if (user.role === "Student") {
            return res.status(200).json({
                success: true,
                nameOfUser,
                message: "You are allowed to access the Student Panel",
                role: "Student",
                user,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Role not recognized"
            });
        }

    } catch (err) {
        console.log("Error in OTP verification:", err.message);
        return res.status(500).json({
            success: false,
            message: "Error in OTP verification"
        });
    }
};



exports.signup = async (req, res) => {
    try {
        const { username, email, password, roll_no } = req.body;

        if (!username || !email || !roll_no) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        // check if any of the user details already exists 
        const checkUsername = await User.findOne({ username : username });
        const checkemail = await User.findOne({ email : email });
        const checkRollNo = await User.findOne({ roll_no : roll_no });

        if(checkUsername) {
            return res.status(400).json({
                success : false,
                message : "Username already exists!"
            })
        }

        if(checkemail) {
            return res.status(400).json({
                success : false,
                message : "Email already exists!"
            })
        }

        if(checkRollNo) {
            return res.status(400).json({
                success : false,
                message : "Roll Number already exists!"
            })
        }

        // If another class student tries to signup and their data is not present
        const doesExist = await Marks.findOne({rollNumber: roll_no});
        if(!doesExist) {
            return res.status(404).json({
                success: false,
                message: "Sorry your Class Data is not available!"
            })
        }


        // Store user details in Redis temporarily
        await redis
            .multi()
            .setex(`user:${email}:username`, 360, username)
            .setex(`user:${email}:email`, 360, email)
            .setex(`user:${email}:password`, 360, password)
            .setex(`user:${email}:roll_no`, 360, roll_no)
            .setex(`user:${email}:function_name`, 360, "signup")
            .exec();

        // **Rate limiting OTP requests**
        const otpRequestedRecently = await redis.get(`user:${email}:otp_requested`);
        if (otpRequestedRecently) {
            return res.status(429).json({
                success: false,
                message: "You can request a new OTP after 1 minute."
            });
        }

        // Send OTP
        await sendmail(email, "signup");
        console.log(`Mail sent to email ${email}`);

        // **Set rate limit flag (expires in 60 seconds)**
        await redis.setex(`user:${email}:otp_requested`, 60, "true");

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully!"
        });

    } catch (err) {
        console.log("Error in Sign up:", err);
        return res.status(500).json({
            success: false,
            message: "Error in Sign Up Route Handler"
        });
    }
};


// Logout Route Handler ------------>

exports.logout = (req, res) => {
    try {
        // Clear the JWT token cookie by setting its expiration to a past date
        // res.clearCookie('newCookie');  // 'newCookie' is the name of the cookie storing the token

        res.clearCookie("newCookie", {
            httpOnly: true,
            secure: true, // Ensure it’s cleared over HTTPS
            sameSite: "None",
            path: "/",
            domain: "rank-check.vercel.app"
        });

        console.log("req.cookie after clearing : ", req.cookies);

        // Optionally, you can also send a response to notify the user that they have logged out
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({
            success: false,
            message: "Error in logging out"
        })
    }
}


exports.resetPassword = async(req, res) => {
    try{

        const { email } = req.body;
        
        const checkEmail = await User.findOne({email});
        if(!checkEmail) {
            return res.status(404).json({
                success: false,
                message: "User not registered"
            })
        }

        // Send OTP
        await sendmail(email, "pswd_reset");
        console.log(`Mail sent to email for pswd reset : ${email}`);

        // save email in redis to access it later to change the password (we'll need it to find the user)
        await redis.setex(`user:data`, 300, email); // Expires in 5 minutes

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully!"
        });

    } catch(err) {
        console.log("Error in Reset Password :", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


exports.resetPswdOTP = async(req, res) => {
    try{

        const { otp, email } = req.body;

        // Fetch OTP from Redis (per-user storage) {OTP is set in otp.jsx (send email function)}
        const OTP = await redis.get(`user:${email}:otp`);

        // Check if OTP exists
        if (!OTP) {
            return res.status(400).json({ success: false, message: "OTP expired or not found. Request a new OTP." });
        }

        // Validate OTP 
        const isValid = await verifyOTP(OTP, otp);
        if (!isValid) {
            return res.status(401).json({ success: false, message: "Incorrect OTP, try again" });
        }

        // OTP is valid, remove the entries from redis
        await redis.del(`user:${email}:otp`);
        await redis.del(`user:${email}:otp_requested`); // Allow new OTP requests after verification

        return res.status(200).json({
            success: true,
            message: "OTP verification successful"
        })

    } catch(err) {
        console.log("Error in reset password OTP : ", err);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.changePassword = async(req, res) => {
    try{

        const { newPswd } = req.body;
        const email = await redis.get(`user:data`);

        // get the user using the email
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "Aisa kaise ho skta hai, email gayab ho gya :("
            })
        }

        const userID = user._id;
        const hashedPswd = await bcrypt.hash(newPswd, 10);

        // **Find user by ID and update password**
        const updatedUser = await User.findByIdAndUpdate(
            userID,
            { password: hashedPswd },
            { new: true } // Returns the updated document
        );

        if(!updatedUser) {
            return res.status(400).json({
                success: false,
                message: "User not updated"
            })
        }

        // deleting the email that we stored 
        await redis.del("user:data");

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })

    } catch(err) {
        console.log("Error in changing password : ", err);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}