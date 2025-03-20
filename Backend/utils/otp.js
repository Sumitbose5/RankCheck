const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const User = require("../models/user");
const redis = require("../config/redisClient");

// Generate a 4-digit numeric OTP
const generateOTP = () => {
    return otpGenerator.generate(4, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });
};

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "bosesumit058@gmail.com",  // Sender's email
        pass: "jops qmym uwrh rucq",  // App password from Google
    },
});

// Function to send OTP via email
exports.sendmail = async (email, type) => {
    try {
        // Check if OTP was recently requested (Rate Limiting)
        const otpRequestedRecently = await redis.get(`user:${email}:otp_requested`);
        if (otpRequestedRecently) {
            console.log(`OTP request blocked for ${email} (Too many requests)`);
            return { success: false, message: "You can request a new OTP after 1 minute." };
        }

        // Generate OTP
        let OTP = generateOTP();

        // Store OTP in Redis for the user (expires in 5 minutes)
        await redis.setex(`user:${email}:otp`, 300, OTP);

        // Set rate limiting flag (expires in 60 seconds)
        await redis.setex(`user:${email}:otp_requested`, 60, "true");

        // Send OTP email
        const mailOptions = {
            from: '"RankCheck Support" <bosesumit058@gmail.com>',
            to: email,
            subject: type === "signup"
                ? "🔐 RankCheck OTP Verification Code"
                : "🔒 RankCheck Password Reset OTP",
            html: type === "signup"
                ? `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                        <h2 style="text-align: center; color: #333;">RankCheck OTP Verification</h2>
                        <p>Hello,</p>
                        <p>Thank you for signing up with <strong>RankCheck</strong>! To complete your registration, please use the following OTP:</p>
                        <div style="text-align: center; font-size: 22px; font-weight: bold; background: #007bff; color: #fff; padding: 10px; border-radius: 5px; width: fit-content; margin: 10px auto;">
                            ${OTP}
                        </div>
                        <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
                        <p>If you did not request this, you can safely ignore this email.</p>
                        <br>
                        <p style="color: #555;">Best regards,</p>
                        <p><strong>RankCheck Team</strong></p>
                    </div>
                `
                : `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                        <h2 style="text-align: center; color: #333;">Reset Your RankCheck Password</h2>
                        <p>Hello,</p>
                        <p>We received a request to reset your <strong>RankCheck</strong> account password. Use the OTP below to proceed:</p>
                        <div style="text-align: center; font-size: 22px; font-weight: bold; background: #dc3545; color: #fff; padding: 10px; border-radius: 5px; width: fit-content; margin: 10px auto;">
                            ${OTP}
                        </div>
                        <p>This OTP is valid for <strong>5 minutes</strong>. If you did not request a password reset, please ignore this email.</p>
                        <br>
                        <p style="color: #555;">Best regards,</p>
                        <p><strong>RankCheck Team</strong></p>
                    </div>
                `,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log("OTP sent to:", email, "Message ID:", info.messageId);
        return { success: true, message: "OTP sent successfully!" };

    } catch (err) {
        console.error("Error sending email:", err);
        return { success: false, message: "Error sending OTP." };
    }
};




// OTP Verification
exports.verifyOTP = async (OTP, inputOTP) => {
    try {
        if (!OTP || !inputOTP) return false;

        if (OTP !== inputOTP) return false;

        // Clear OTP after successful verification 
        return true;
    } catch (err) {
        console.log("Error in verifying OTP:", err.message);
        return false;
    }
};