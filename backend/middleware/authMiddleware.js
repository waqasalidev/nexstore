import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode token
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        if (process.env.NODE_ENV === "production") {
          throw new Error("CRITICAL ERROR: JWT_SECRET environment variable is not defined in production!");
        }
        console.warn("WARNING: JWT_SECRET is not defined, falling back to development secret.");
      }
      const decoded = jwt.verify(token, secret || "nexstore_jwt_secret_key_123");

      // Attach user to request
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, admin privilege required" });
  }
};
