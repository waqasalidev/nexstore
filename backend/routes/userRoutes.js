import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getAllUsers,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/profile")
  .get(getUserProfile)
  .put(updateUserProfile);

router.route("/")
  .get(adminOnly, getAllUsers)
  .delete(deleteUserAccount);

export default router;

