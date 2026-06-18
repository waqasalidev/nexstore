import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, brand, search, featured } = req.query;
    let query = {};

    if (featured === "true") {
      query.featured = true;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Filter by category slug
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        query.category_id = cat._id;
      } else {
        return res.json([]);
      }
    }

    // Filter by brand slug
    if (brand) {
      const matchingBrands = await Brand.find({
        $or: [
          { slug: brand },
          { slug: { $regex: `^${brand}-`, $options: "i" } }
        ]
      });
      if (matchingBrands && matchingBrands.length > 0) {
        query.brand_id = { $in: matchingBrands.map(b => b._id) };
      } else {
        return res.json([]);
      }
    }

    const products = await Product.find(query)
      .populate("category_id", "name slug")
      .populate("brand_id", "name slug")
      .sort({ createdAt: -1 });

    const formattedProducts = products.map((p) => {
      const pJson = p.toJSON();
      return {
        ...pJson,
        id: p._id.toString(),
        categories: pJson.category_id ? { name: pJson.category_id.name, slug: pJson.category_id.slug } : null,
        brands: pJson.brand_id ? { name: pJson.brand_id.name, slug: pJson.brand_id.slug } : null,
      };
    });

    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category_id", "name slug")
      .populate("brand_id", "name slug");

    if (product) {
      const pJson = product.toJSON();
      res.json({
        ...pJson,
        id: product._id.toString(),
        categories: pJson.category_id ? { name: pJson.category_id.name, slug: pJson.category_id.slug } : null,
        brands: pJson.brand_id ? { name: pJson.brand_id.name, slug: pJson.brand_id.slug } : null,
      });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount_percent,
      category_id,
      brand_id,
      image,
      stock,
      colors,
      sizes,
      featured,
    } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      discount_percent: discount_percent || 0,
      category_id: category_id || null,
      brand_id: brand_id || null,
      images: image ? [image] : [],
      stock: stock || 0,
      featured: featured || false,
      colors: colors || [],
      sizes: sizes || [],
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price !== undefined ? req.body.price : product.price;
      product.discount_percent = req.body.discount_percent !== undefined ? req.body.discount_percent : product.discount_percent;
      product.category_id = req.body.category_id !== undefined ? req.body.category_id : product.category_id;
      product.brand_id = req.body.brand_id !== undefined ? req.body.brand_id : product.brand_id;
      product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
      product.featured = req.body.featured !== undefined ? req.body.featured : product.featured;
      product.images = req.body.images || product.images;
      product.colors = req.body.colors || product.colors;
      product.sizes = req.body.sizes || product.sizes;

      if (req.body.name) {
        product.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


