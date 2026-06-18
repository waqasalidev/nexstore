import Review from "../models/Review.js";
import Product from "../models/Product.js";

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product_id: req.params.productId })
      .populate("user_id", "display_name avatar_url")
      .sort({ createdAt: -1 });

    const formatted = reviews.map((r) => {
      const rJson = r.toJSON();
      return {
        ...rJson,
        id: r._id.toString(),
        created_at: r.createdAt,
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product review
// @route   POST /api/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  const { product_id, rating, comment } = req.body;

  try {
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      product_id,
      user_id: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const review = await Review.create({
      product_id,
      user_id: req.user._id,
      rating: Number(rating),
      comment,
    });

    // Update product average rating and review count
    const reviews = await Review.find({ product_id });
    product.review_count = reviews.length;
    product.rating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();

    res.status(201).json({
      ...review.toJSON(),
      id: review._id.toString(),
      created_at: review.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
