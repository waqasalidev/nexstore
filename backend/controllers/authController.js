import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper to generate JWT token
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CRITICAL ERROR: JWT_SECRET environment variable is not defined in production!");
    }
    console.warn("WARNING: JWT_SECRET is not defined, falling back to development secret.");
  }
  return jwt.sign({ id }, secret || "nexstore_jwt_secret_key_123", {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      display_name: name,
      email,
      password,
      role: "user", // default role
    });

    if (user) {
      res.status(201).json({
        id: user._id,
        name: user.display_name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        id: user._id,
        name: user.display_name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    if (req.user) {
      res.json({
        id: req.user._id,
        name: req.user.display_name,
        email: req.user.email,
        role: req.user.role,
        avatar_url: req.user.avatar_url,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = async (req, res) => {
  res.json({ message: "User logged out successfully" });
};
