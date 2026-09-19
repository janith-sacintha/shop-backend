import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";

const pw = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    service: "gmail",
    auth: {
        user: "janith.sachintha.dev@gmail.com",
        pass: pw
    }
});

export async function createUser(req, res) {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long"
            });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser != null) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const passwordHash = bcrypt.hashSync(password, 10);

        const user = new User({
            firstName,
            lastName,
            email: normalizedEmail,
            password: passwordHash
        });

        await user.save();

        res.json({ message: "User created successfully" });

    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}


export async function userLogin(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (user == null) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(403).json({
                message: "Incorrect password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isBlocked: user.isBlocked,
                isEmailVerified: user.isEmailVerified,
                image: user.image
            },
            process.env.JWT_SECRET
        );

        res.json({
            token: token,
            message: "Login successful",
            role: user.role
        });

    } catch (err) {
        console.error("Error logging in user:", err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export function getUser(req, res) {
    if (req.user == null) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({
        name: req.user,          
        email: req.user.email,
        role: req.user.role
    });
}

export function isAdmin(req){
    if(req.user == null){
        return false;
    }

    if(req.user.role == "admin"){
        return true;
    }else{
        return false;
    }
}

export async function googleLogin(req, res) {
    const googleToken = req.body.token;

    try {
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${googleToken}`
            }
        });

        const googleUser = response.data;
        let user = await User.findOne({ email: googleUser.email });

        if (user == null) {
            user = new User({
                firstName: googleUser.given_name,
                lastName: googleUser.family_name,
                email: googleUser.email,
                role: "user",
                isEmailVerified: true,
                password: "123"
            });
            await user.save();
        }

        const token = jwt.sign(
            {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isBlocked: user.isBlocked,
                isEmailVerified: user.isEmailVerified,
                image: user.image
            },
            process.env.JWT_SECRET
        );

        res.json({
            token: token,
            message: "Google login successful",
            role: user.role
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to fetch user info from Google"
        });
    }
}

export async function sendOTP(req, res) {
    const email = req.body.email;

    const otpCode = Math.floor(Math.random() * 1000000);

    //delete any existing OTP for the email
    try {
        await OTP.deleteMany({ email: email }); 
        const newOTP = new OTP({ email: email, otp: otpCode });
        await newOTP.save();

    } catch (error) {
        console.error(error);
    }

    const mailOptions = {
        from: "janith.sachintha.dev@gmail.com",
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otpCode}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send OTP" });
    }

}

export async function resetPassword(req, res) {
    const email = req.body.email;
    const otp = req.body.otp;
    const newPassword = req.body.newPassword;

    const otpRecord = await OTP.findOne({ email: email, otp: otp });

    if (!otpRecord) {
        res.status(400).json({ message: "Invalid OTP" });
        return;
    }

    const passwordHash = bcrypt.hashSync(newPassword, 10);

    try {
        await User.updateOne({ email: email }, { password: passwordHash });
        await OTP.deleteMany({ email: email });
        res.json({ message: "Password reset successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to reset password" });
    }
}