import Address from "../models/Address.js";

// @desc    Get all addresses for logged in user
// @route   GET /api/addresses
// @access  Private
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user_id: req.user._id }).sort({ createdAt: -1 });
    
    const formatted = addresses.map(addr => {
      const aJson = addr.toJSON();
      return {
        ...aJson,
        id: addr._id.toString()
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new address
// @route   POST /api/addresses
// @access  Private
export const addAddress = async (req, res) => {
  const { name, phone, line1, city, state, country, zip, is_default } = req.body;

  try {
    // If is_default is true, unset default on other addresses first
    if (is_default) {
      await Address.updateMany({ user_id: req.user._id }, { is_default: false });
    }

    const address = await Address.create({
      user_id: req.user._id,
      name,
      phone: phone || "",
      line1,
      city,
      state: state || "",
      country,
      zip,
      is_default: is_default || false
    });

    res.status(201).json({
      ...address.toJSON(),
      id: address._id.toString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an address
// @route   PUT /api/addresses/:id
// @access  Private
export const updateAddress = async (req, res) => {
  const { name, phone, line1, city, state, country, zip, is_default } = req.body;

  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (address.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to modify this address" });
    }

    // If setting to default, unset other defaults
    if (is_default && !address.is_default) {
      await Address.updateMany({ user_id: req.user._id }, { is_default: false });
    }

    address.name = name || address.name;
    address.phone = phone !== undefined ? phone : address.phone;
    address.line1 = line1 || address.line1;
    address.city = city || address.city;
    address.state = state !== undefined ? state : address.state;
    address.country = country || address.country;
    address.zip = zip || address.zip;
    address.is_default = is_default !== undefined ? is_default : address.is_default;

    const updated = await address.save();

    res.json({
      ...updated.toJSON(),
      id: updated._id.toString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private
export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (address.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this address" });
    }

    await Address.findByIdAndDelete(req.params.id);
    res.json({ message: "Address deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
