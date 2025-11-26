import User from "../models/User.js";
import Provider from "../models/Provider.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const register = async (req, res) => {
  try {
    const { name, email, password, mobile, role, location } = req.body;

    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      mobile,
      role: role || "user",
    });

    if (location && Array.isArray(location)) {
      user.location = { type: "Point", coordinates: location };
    }

    const otp = generateOtp();
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    };

    await user.save();

    if (user.role === "provider") {
      await new Provider({ user: user._id }).save();
    }

    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: user.email,
      subject: "Verify your account",
      html: `<p>Your verification code is <b>${otp}</b></p>`,
    });

    res.status(201).json({
      message: "Registered successfully. Check your email for the OTP.",
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({ message: "Missing OTP or user ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const invalid =
      !user.otp ||
      user.otp.code !== code ||
      user.otp.expiresAt < new Date();

    if (invalid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.verified = true;
    user.otp = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Account verified",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.verified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    const otp = generateOtp();
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    };

    await user.save();

    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: user.email,
      subject: "Your new verification code",
      html: `<p>Your new OTP is <b>${otp}</b></p>`,
    });

    res.json({ message: "New OTP sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.verified) {
      const otp = generateOtp();
      user.otp = {
        code: otp,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      };

      await user.save();

      await transporter.sendMail({
        from: process.env.NODEMAILER_USER,
        to: user.email,
        subject: "Verify your account",
        html: `<p>Your OTP is <b>${otp}</b></p>`,
      });

      return res.status(403).json({
        message: "Account not verified. OTP sent again.",
        userId: user._id,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    user.resetToken = {
      code: otp,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    };

    await user.save();

    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: user.email,
      subject: "Reset your password",
      html: `<p>Your reset code is <b>${otp}</b></p>`,
    });

    res.json({ message: "Reset code sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.resetToken)
      return res.status(400).json({ message: "Invalid request" });

    const invalid =
      user.resetToken.code !== code ||
      user.resetToken.expiresAt < new Date();

    if (invalid) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;

    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;

    const user = await User.findById(req.user._id);

    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match)
      return res.status(400).json({ message: "Old password wrong" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const found = await User.findById(req.params.id).select("-password");
    if (!found) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(found);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
