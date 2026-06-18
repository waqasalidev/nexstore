import express from "express";
import {
  getOrders,
  createOrder,
  updateOrderStatus,
  getMyOrders,
  getOrderById,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/my-orders", getMyOrders);

router.route("/")
  .get(getOrders)
  .post(createOrder);

router.route("/:id")
  .get(getOrderById)
  .put(adminOnly, updateOrderStatus);

export default router;
