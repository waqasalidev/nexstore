import User from "../models/User.js";
import Address from "../models/Address.js";
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";
import Order from "../models/Order.js";
import Notification from "../models/Notification.js";
import SupportTicket from "../models/SupportTicket.js";

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.display_name = req.body.name || user.display_name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.avatar_url = req.body.avatar_url !== undefined ? req.body.avatar_url : user.avatar_url;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    
    // Omit password from return
    const userJson = updatedUser.toJSON();
    delete userJson.password;

    res.json(userJson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user account
// @route   DELETE /api/user
// @access  Private
export const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete user details
    await User.findByIdAndDelete(userId);

    // Cascade delete user data
    await Address.deleteMany({ user_id: userId });
    await Cart.deleteMany({ user_id: userId });
    await Wishlist.deleteMany({ user_id: userId });
    await Order.deleteMany({ user_id: userId });
    await Notification.deleteMany({ user_id: userId });
    await SupportTicket.deleteMany({ user_id: userId });

    res.json({ message: "Account deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users with complete orders, spending, and addresses for admin
// @route   GET /api/user
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    const formatted = await Promise.all(
      users.map(async (u) => {
        const orders = await Order.find({ user_id: u._id }).sort({ createdAt: -1 });
        const addresses = await Address.find({ user_id: u._id });
        const lastOrder = orders[0];
        
        const totalSpending = orders
          .filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + Number(o.total || 0), 0);

        return {
          id: u._id.toString(),
          name: u.display_name || "Unknown",
          email: u.email,
          phone: u.phone || "N/A",
          role: u.role,
          joinDate: u.createdAt,
          totalOrders: orders.length,
          lastActivity: lastOrder ? lastOrder.createdAt : u.updatedAt || u.createdAt,
          orders: orders.map((o) => ({
            id: o._id.toString(),
            total: o.total,
            status: o.status,
            created_at: o.createdAt,
            items: o.items,
          })),
          totalSpending,
          shippingAddresses: addresses.map((addr) => ({
            name: addr.name,
            phone: addr.phone,
            line1: addr.line1,
            city: addr.city,
            state: addr.state,
            country: addr.country,
            zip: addr.zip,
            is_default: addr.is_default,
          })),
        };
      })
    );

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

