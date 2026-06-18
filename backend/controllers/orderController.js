import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Notification from "../models/Notification.js";
import Product from "../models/Product.js";


// @desc    Get all orders for a user (or all if admin)
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== "admin") {
      query.user_id = req.user._id;
    }

    const orders = await Order.find(query).populate("user_id", "display_name email phone").sort({ createdAt: -1 });

    const formatted = orders.map((o) => {
      const oJson = o.toJSON();
      return {
        ...oJson,
        id: o._id.toString(),
        created_at: o.createdAt, // compatible with frontend created_at
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const { total, shipping_address, items } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = await Order.create({
      user_id: req.user._id,
      total,
      shipping_address,
      items,
      status: "pending",
    });

    // Clear user's cart after placing the order
    const cart = await Cart.findOne({ user_id: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    // Update product stock and sold quantity
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        product.sold = (product.sold || 0) + item.quantity;
        await product.save();
      }
    }


    // Generate Order Notification
    await Notification.create({
      user_id: req.user._id,
      title: "Order Placed Successfully",
      message: `Your order #${order._id.toString().slice(-8).toUpperCase()} for ${items.length} item(s) has been placed successfully.`,
      type: "order"
    });

    res.status(201).json({
      ...order.toJSON(),
      id: order._id.toString(),
      created_at: order.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user._id }).sort({ createdAt: -1 });
    
    const formatted = orders.map((o) => {
      const oJson = o.toJSON();
      return {
        ...oJson,
        id: o._id.toString(),
        created_at: o.createdAt,
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user_id", "display_name email phone")
      .populate("items.product_id", "name images slug price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Authorization: Only the order owner or admin can view details
    // After populate(), user_id is an object so we must compare using ._id
    const orderUserId = order.user_id?._id || order.user_id;
    if (req.user.role !== "admin" && orderUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to access this order" });
    }

    const formatted = {
      ...order.toJSON(),
      id: order._id.toString(),
      created_at: order.createdAt,
    };

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
