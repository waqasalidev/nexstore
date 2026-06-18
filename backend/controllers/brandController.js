import mongoose from "mongoose";
import Brand from "../models/Brand.js";
import Category from "../models/Category.js";

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
export const getBrands = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category) {
      // Find category first (by slug)
      const cat = await Category.findOne({ slug: category.trim().toLowerCase() });
      if (cat) {
        query.category_id = cat._id;
      } else {
        // If not found, check if it matches category_id directly
        if (mongoose.isValidObjectId(category)) {
          query.category_id = category;
        } else {
          // Avoid CastError by setting a query that matches nothing
          query.category_id = new mongoose.Types.ObjectId();
        }
      }
    }

    const brands = await Brand.find(query).populate("category_id", "name slug").sort({ name: 1 });
    
    // Deduplicate brands by name (case-insensitive)
    const uniqueBrandsMap = new Map();
    brands.forEach(b => {
      const nameKey = b.name.trim().toLowerCase();
      if (!uniqueBrandsMap.has(nameKey)) {
        uniqueBrandsMap.set(nameKey, b);
      }
    });
    const uniqueBrands = Array.from(uniqueBrandsMap.values());

    const formatted = uniqueBrands.map(b => ({
      ...b.toJSON(),
      id: b._id.toString(),
      category: b.category_id ? b.category_id.name : ""
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a brand
// @route   POST /api/brands
// @access  Private/Admin
export const createBrand = async (req, res) => {
  try {
    const { name, logo_url, category_id, category } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Brand name is required" });
    }

    let catId = category_id || null;
    if (category && typeof category === "string") {
      const cat = await Category.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${category.trim()}$`, "i") } },
          { slug: category.trim().toLowerCase() }
        ]
      });
      if (cat) {
        catId = cat._id;
      }
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    const brand = await Brand.create({
      name: name.trim(),
      slug,
      logo_url: logo_url || "",
      category_id: catId
    });

    const populated = await brand.populate("category_id", "name slug");
    res.status(201).json({
      ...populated.toJSON(),
      id: populated._id.toString(),
      category: populated.category_id ? populated.category_id.name : ""
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
export const updateBrand = async (req, res) => {
  try {
    const { name, logo_url, category_id, category } = req.body;
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    if (name) {
      brand.name = name.trim();
      brand.slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    }
    if (logo_url !== undefined) brand.logo_url = logo_url;

    if (category_id !== undefined) {
      brand.category_id = category_id || null;
    } else if (category !== undefined) {
      if (category && typeof category === "string") {
        const cat = await Category.findOne({
          $or: [
            { name: { $regex: new RegExp(`^${category.trim()}$`, "i") } },
            { slug: category.trim().toLowerCase() }
          ]
        });
        brand.category_id = cat ? cat._id : null;
      } else {
        brand.category_id = null;
      }
    }

    await brand.save();
    const populated = await brand.populate("category_id", "name slug");
    res.json({
      ...populated.toJSON(),
      id: populated._id.toString(),
      category: populated.category_id ? populated.category_id.name : ""
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    await Brand.findByIdAndDelete(req.params.id);
    res.json({ message: "Brand removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
