import express from "express";
import { getBrands, createBrand, updateBrand, deleteBrand } from "../controllers/brandController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getBrands)
  .post(protect, adminOnly, createBrand);

router.route("/:id")
  .put(protect, adminOnly, updateBrand)
  .delete(protect, adminOnly, deleteBrand);

export default router;
