import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discount_percent: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    active: {
      type: Boolean,
      default: true,
    },
    expiry_date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
