import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// @desc    Get user wishlist items
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user_id: req.user._id }).populate({
      path: "products",
      populate: {
        path: "brand_id",
        select: "name slug",
      },
    });

    if (!wishlist || !wishlist.products) {
      return res.json([]);
    }

    const formatted = wishlist.products
      .map((p) => {
        if (!p) return null;
        const pJson = p.toJSON();
        return {
          id: p._id.toString(), // use product ID as item ID
          user_id: req.user._id.toString(),
          product_id: p._id.toString(),
          products: {
            ...pJson,
            id: p._id.toString(),
            brands: pJson.brand_id ? { name: pJson.brand_id.name, slug: pJson.brand_id.slug } : null,
          },
        };
      })
      .filter(Boolean);

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle item in wishlist (Add/Remove)
// @route   POST /api/wishlist
// @access  Private
export const toggleWishlist = async (req, res) => {
  const { product_id } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ user_id: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user_id: req.user._id, products: [] });
    }

    const itemIndex = wishlist.products.findIndex(
      (id) => id.toString() === product_id
    );

    let added = false;
    if (itemIndex > -1) {
      // Remove item
      wishlist.products.splice(itemIndex, 1);
    } else {
      // Add item
      wishlist.products.push(product_id);
      added = true;
    }

    await wishlist.save();
    res.json({ added });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
