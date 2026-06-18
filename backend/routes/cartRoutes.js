import express from "express";
import {
  getCart,
  addToCart,
  updateCartQty,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.route("/:id")
  .put(updateCartQty)
  .delete(removeFromCart);

export default router;
