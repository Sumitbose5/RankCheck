const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generateTokenAndSetCookie = (user, res) => {

    const payload = {
        email: user.email,
        id: user._id,
        role: user.role,
    }

    console.log("User inside generate token (f) : ", user)

    try {
        console.log("Inside generate token function")
        let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

        console.log("Token created");

        let options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),    // Token validity only for 1 day
            httpOnly: true,
            secure: true,  // Required for HTTPS
            sameSite: "None", // Allows cross-origin cookies
            path: "/"
        }

        // Set the cookie, but DON'T send a response
        res.cookie("newCookie", token, options);  // Just set the cookie
        console.log("TOken : ", token);
        return token; // Return the token, so the calling function can use it if needed 

    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
}
