import express from "express";
import {
  getTickets,
  createTicket,
  replyToTicket,
} from "../controllers/supportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getTickets)
  .post(createTicket);

router.route("/:id/reply")
  .post(replyToTicket);

export default router;
