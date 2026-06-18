import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent multiple reviews from the same user on the same product
reviewSchema.index({ product_id: 1, user_id: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
