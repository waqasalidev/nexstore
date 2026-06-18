import express from "express";
import {
  getProductReviews,
  createProductReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);
router.post("/", protect, createProductReview);

export default router;
