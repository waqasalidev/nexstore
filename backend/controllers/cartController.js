import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// @desc    Get user cart items
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user_id: req.user._id }).populate({
      path: "items.product_id",
      populate: {
        path: "brand_id",
        select: "name slug",
      },
    });

    if (!cart) {
      return res.json([]);
    }

    const formatted = cart.items
      .map((item) => {
        const p = item.product_id;
        if (!p) return null;
        const pJson = p.toJSON();
        return {
          id: item._id.toString(),
          user_id: req.user._id.toString(),
          product_id: p._id.toString(),
          quantity: item.quantity,
          selected_size: item.selected_size,
          selected_color: item.selected_color,
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

// @desc    Add item to cart / Update item if exists
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  const { product_id, quantity, size, color } = req.body;

  try {
    let cart = await Cart.findOne({ user_id: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user_id: req.user._id, items: [] });
    }

    // Check if the item (product, size, color) already exists in cart
    const existingIndex = cart.items.findIndex(
      (item) =>
        item.product_id.toString() === product_id &&
        item.selected_size === (size || null) &&
        item.selected_color === (color || null)
    );

    if (existingIndex > -1) {
      // If it exists, update the quantity (or replace it, Supabase does upsert)
      cart.items[existingIndex].quantity = quantity || 1;
    } else {
      // Add new item
      cart.items.push({
        product_id,
        quantity: quantity || 1,
        selected_size: size || null,
        selected_color: color || null,
      });
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
export const updateCartQty = async (req, res) => {
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user_id: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === req.params.id
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.json({ message: "Cart updated" });
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user_id: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.id
    );

    await cart.save();
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user_id: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
