const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.auth = (req, res, next) => {
    try {
        // fetch the cookie 
        // const token = req.cookies.newCookie || req.body.token || req.header("Authorization").replace("Bearer ", "");
        const token = req.cookies.newCookie;

        if (!token || token === undefined) {
            return res.status(401).json({
                success: false, 
                message: "Token not found"
            })
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            // console.log("Decoded : ", decode);

            req.user = decode;

        } catch (err) {
            console.log(err.message);
            return res.status(401).json({
                success: false,
                message: "Token in invalid"
            })
        }
        // Move to next middleware
        next();

    } catch(err){
        console.log(err.message); 
        return res.status(500).json({
            success : false,
            message : "Something went wrong, while verifying the token"
        })
    }  
}


exports.isStudent = (req, res, next) => {
    try{
        if(req.user.role !== "Student" && req.user.role !== "Admin"){
            return res.status(401).json({ 
                success : false,
                message : "Permission prohibited, only students are allowed!"
            })
        }
        // Move to next middleware
        next();
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Something went wrong while checking is Student or not."
        })
    }
}


exports.isAdmin = (req, res, next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success : false,
                message : "Permission prohibited, only admin is allowed!"
            })
        }
        // Move to next middleware
        next();
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Something went wrong while checking is Admin or not."
        })
    }
}