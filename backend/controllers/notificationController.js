import Notification from "../models/Notification.js";

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user._id }).sort({ createdAt: -1 });
    
    const formatted = notifications.map(n => {
      const nJson = n.toJSON();
      return {
        ...nJson,
        id: n._id.toString()
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to modify this notification" });
    }

    notification.read = true;
    const updated = await notification.save();

    res.json({
      ...updated.toJSON(),
      id: updated._id.toString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this notification" });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
