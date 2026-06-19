import mongoose from "mongoose";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";

/**
 * Auto-seeds the database if it is completely empty.
 * Safe to call on every server start — it checks before inserting.
 */
export const autoSeedIfEmpty = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount > 0) {
      console.log(`Auto-seed skipped: ${productCount} products already exist.`);
      return;
    }

    console.log("Database is empty — starting auto-seed...");

    // ─── Categories ─────────────────────────────────────────────────────────────
    const categoriesData = [
      { name: "Clothing", slug: "clothing", description: "Premium apparel and clothing" },
      { name: "Shoes", slug: "shoes", description: "Iconic footwear and sneakers" },
      { name: "Watches", slug: "watches", description: "Time, luxury, and technology reimagined" },
      { name: "Electronics", slug: "electronics", description: "Next-gen personal tech and gadgets" },
      { name: "Accessories", slug: "accessories", description: "Defining details and luxury bags" },
      { name: "Sports", slug: "sports", description: "Athletic wear and sports equipment" },
      { name: "Luxury Items", slug: "luxury", description: "Exclusive luxury accessories and collectibles" },
    ];

    await Category.deleteMany({});
    const categories = await Category.insertMany(categoriesData);
    const catMap = {};
    categories.forEach(c => { catMap[c.slug] = c._id; });
    console.log("✓ Categories seeded");

    // ─── Brands ──────────────────────────────────────────────────────────────────
    const brandsData = [
      { name: "Nike", slug: "nike", category_id: catMap["clothing"], logo_url: "" },
      { name: "Adidas", slug: "adidas", category_id: catMap["clothing"], logo_url: "" },
      { name: "Gucci", slug: "gucci", category_id: catMap["clothing"], logo_url: "" },
      { name: "Prada", slug: "prada", category_id: catMap["clothing"], logo_url: "" },
      { name: "Levi's", slug: "levis", category_id: catMap["clothing"], logo_url: "" },
      { name: "Nike", slug: "nike-shoes", category_id: catMap["shoes"], logo_url: "" },
      { name: "Adidas", slug: "adidas-shoes", category_id: catMap["shoes"], logo_url: "" },
      { name: "Converse", slug: "converse", category_id: catMap["shoes"], logo_url: "" },
      { name: "Vans", slug: "vans", category_id: catMap["shoes"], logo_url: "" },
      { name: "Rolex", slug: "rolex", category_id: catMap["watches"], logo_url: "" },
      { name: "Casio", slug: "casio", category_id: catMap["watches"], logo_url: "" },
      { name: "Omega", slug: "omega", category_id: catMap["watches"], logo_url: "" },
      { name: "Apple", slug: "apple", category_id: catMap["electronics"], logo_url: "" },
      { name: "Samsung", slug: "samsung", category_id: catMap["electronics"], logo_url: "" },
      { name: "Sony", slug: "sony", category_id: catMap["electronics"], logo_url: "" },
      { name: "Bose", slug: "bose", category_id: catMap["electronics"], logo_url: "" },
      { name: "Gucci", slug: "gucci-accessories", category_id: catMap["accessories"], logo_url: "" },
      { name: "Louis Vuitton", slug: "louis-vuitton", category_id: catMap["accessories"], logo_url: "" },
      { name: "Ray-Ban", slug: "rayban", category_id: catMap["accessories"], logo_url: "" },
      { name: "Nike", slug: "nike-sports", category_id: catMap["sports"], logo_url: "" },
      { name: "Adidas", slug: "adidas-sports", category_id: catMap["sports"], logo_url: "" },
    ];

    await Brand.deleteMany({});
    const brands = await Brand.insertMany(brandsData);
    const brandMap = {};
    brands.forEach(b => { brandMap[b.slug] = b._id; });
    console.log("✓ Brands seeded");

    // ─── Image pools ─────────────────────────────────────────────────────────────
    const imgs = {
      clothing: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80",
      ],
      shoes: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=80",
      ],
      watches: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&auto=format&fit=crop&q=80",
      ],
      electronics: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80",
      ],
      accessories: [
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=80",
      ],
      sports: [
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&auto=format&fit=crop&q=80",
      ],
      luxury: [
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=500&auto=format&fit=crop&q=80",
      ],
    };

    const colors = ["Black", "White", "Navy", "Red", "Gold", "Heather Grey", "Olive", "Beige"];
    const products = [];

    // ─── Clothing (40 products) ──────────────────────────────────────────────────
    const clothingTypes = ["Sweatshirt", "Chino", "Athletic Tee", "Denim Jacket", "Linen Shirt", "Knit Sweater", "Parka Coat", "Track Jacket", "Cargo Pants", "Slim Suit"];
    const clothingBrands = ["nike", "adidas", "gucci", "prada", "levis"];
    for (let i = 1; i <= 40; i++) {
      const bSlug = clothingBrands[i % clothingBrands.length];
      const type = clothingTypes[i % clothingTypes.length];
      const brandName = bSlug === "levis" ? "Levi's" : bSlug.charAt(0).toUpperCase() + bSlug.slice(1);
      const name = `${brandName} ${type} v${i}`;
      products.push({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description: `Premium quality ${brandName} ${type.toLowerCase()} — crafted for style, comfort, and everyday wear.`,
        price: Math.floor(Math.random() * 220) + 29,
        discount_percent: i % 3 === 0 ? Math.floor(Math.random() * 40) + 10 : 0,
        category_id: catMap["clothing"],
        brand_id: brandMap[bSlug] || null,
        images: [imgs.clothing[i % imgs.clothing.length]],
        stock: Math.floor(Math.random() * 80) + 10,
        rating: +(Math.random() * 1.5 + 3.5).toFixed(1),
        review_count: Math.floor(Math.random() * 80) + 2,
        featured: i <= 4,
        colors: [colors[i % colors.length], colors[(i + 2) % colors.length]],
        sizes: ["XS", "S", "M", "L", "XL"],
      });
    }

    // ─── Shoes (35 products) ─────────────────────────────────────────────────────
    const shoeTypes = ["Air Max Sneaker", "Ultraboost Runner", "Street Trainer", "Speed Knit Shoe", "Leather Oxford", "Trail Boot", "Retro Court Sneaker"];
    const shoeBrands = ["nike-shoes", "adidas-shoes", "converse", "vans"];
    for (let i = 1; i <= 35; i++) {
      const bSlug = shoeBrands[i % shoeBrands.length];
      const type = shoeTypes[i % shoeTypes.length];
      const brandName = bSlug.split("-")[0];
      const displayName = brandName.charAt(0).toUpperCase() + brandName.slice(1);
      const name = `${displayName} ${type} ${i + 100}`;
      products.push({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description: `Step into the future of footwear. Responsive cushioning meets sleek premium aesthetics.`,
        price: Math.floor(Math.random() * 350) + 80,
        discount_percent: i % 4 === 0 ? Math.floor(Math.random() * 30) + 10 : 0,
        category_id: catMap["shoes"],
        brand_id: brandMap[bSlug] || null,
        images: [imgs.shoes[i % imgs.shoes.length]],
        stock: Math.floor(Math.random() * 60) + 3,
        rating: +(Math.random() * 1.3 + 3.7).toFixed(1),
        review_count: Math.floor(Math.random() * 120) + 5,
        featured: i <= 4,
        colors: [colors[i % colors.length], "Gold"],
        sizes: ["7", "8", "9", "10", "11", "12"],
      });
    }

    // ─── Watches (20 products) ───────────────────────────────────────────────────
    const watchTypes = ["Submariner Luxury", "Speedmaster Chrono", "Heritage Automatic", "Smartwatch Active", "Minimalist Quartz"];
    const watchBrands = ["rolex", "casio", "omega"];
    for (let i = 1; i <= 20; i++) {
      const bSlug = watchBrands[i % watchBrands.length];
      const type = watchTypes[i % watchTypes.length];
      const displayName = bSlug.charAt(0).toUpperCase() + bSlug.slice(1);
      const name = `${displayName} ${type} Series ${i}`;
      products.push({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description: `A masterclass in precision. Crafted from marine-grade alloys with waterproof reliability.`,
        price: Math.floor(Math.random() * 5000) + 99,
        discount_percent: i % 5 === 0 ? Math.floor(Math.random() * 15) + 5 : 0,
        category_id: catMap["watches"],
        brand_id: brandMap[bSlug] || null,
        images: [imgs.watches[i % imgs.watches.length]],
        stock: Math.floor(Math.random() * 20) + 2,
        rating: +(Math.random() * 0.9 + 4.1).toFixed(1),
        review_count: Math.floor(Math.random() * 50) + 1,
        featured: i <= 3,
        colors: ["Gold", "Silver", "Space Black"],
        sizes: ["One Size"],
      });
    }

    // ─── Electronics (40 products) ───────────────────────────────────────────────
    const elecTypes = ["Noise Cancelling Headphones", "Wireless Earbuds", "Ultra Phone", "Portable Speaker", "Smart Tablet", "Slim Laptop", "Mechanical Keyboard"];
    const elecBrands = ["apple", "samsung", "sony", "bose"];
    for (let i = 1; i <= 40; i++) {
      const bSlug = elecBrands[i % elecBrands.length];
      const type = elecTypes[i % elecTypes.length];
      const displayName = bSlug.charAt(0).toUpperCase() + bSlug.slice(1);
      const name = `${displayName} ${type} X${i}`;
      products.push({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description: `State-of-the-art processor, rich acoustics, and high-definition visuals. Built for daily comfort.`,
        price: Math.floor(Math.random() * 1400) + 49,
        discount_percent: i % 3 === 0 ? Math.floor(Math.random() * 35) + 5 : 0,
        category_id: catMap["electronics"],
        brand_id: brandMap[bSlug] || null,
        images: [imgs.electronics[i % imgs.electronics.length]],
        stock: Math.floor(Math.random() * 150) + 10,
        rating: +(Math.random() * 1.1 + 3.9).toFixed(1),
        review_count: Math.floor(Math.random() * 300) + 12,
        featured: i <= 4,
        colors: ["Graphite", "Silver", "Gold", "Midnight Black"],
        sizes: ["Standard"],
      });
    }

    // ─── Accessories (15 products) ───────────────────────────────────────────────
    const accTypes = ["Aviator Sunglasses", "Leather Belt", "Monogram Wallet", "Silk Scarf", "Duffel Bag", "Premium Backpack", "Fedora Hat"];
    const accBrands = ["gucci-accessories", "louis-vuitton", "rayban"];
    for (let i = 1; i <= 15; i++) {
      const bSlug = accBrands[i % accBrands.length];
      const type = accTypes[i % accTypes.length];
      const displayName = bSlug === "rayban" ? "Ray-Ban" : bSlug.split("-")[0].charAt(0).toUpperCase() + bSlug.split("-")[0].slice(1);
      const name = `${displayName} ${type} v${i}`;
      products.push({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description: `Elevate your lifestyle. Curated components and dynamic styling for the perfect finishing touch.`,
        price: Math.floor(Math.random() * 550) + 35,
        discount_percent: i % 4 === 0 ? Math.floor(Math.random() * 25) + 5 : 0,
        category_id: catMap["accessories"],
        brand_id: brandMap[bSlug] || null,
        images: [imgs.accessories[i % imgs.accessories.length]],
        stock: Math.floor(Math.random() * 40) + 5,
        rating: +(Math.random() * 1.2 + 3.8).toFixed(1),
        review_count: Math.floor(Math.random() * 70) + 2,
        featured: i <= 2,
        colors: ["Black", "Brown", "Gold"],
        sizes: ["Standard"],
      });
    }

    // ─── Sports (10 products) ────────────────────────────────────────────────────
    for (let i = 1; i <= 10; i++) {
      products.push({
        name: `Nike Sports Fit Pack ${i}`,
        slug: `nike-sports-fit-pack-${i}`,
        description: `High performance athletic gear. Sweat-wicking materials built to optimize your training.`,
        price: Math.floor(Math.random() * 150) + 30,
        discount_percent: 0,
        category_id: catMap["sports"],
        brand_id: brandMap["nike-sports"] || null,
        images: [imgs.sports[i % imgs.sports.length]],
        stock: 35,
        rating: 4.5,
        review_count: 15,
        featured: false,
        colors: ["Neon Green", "Slate Black"],
        sizes: ["S", "M", "L", "XL"],
      });
    }

    // ─── Luxury (8 products) ─────────────────────────────────────────────────────
    for (let i = 1; i <= 8; i++) {
      products.push({
        name: `Gucci Imperial Gold Ring ${i}`,
        slug: `gucci-imperial-gold-ring-${i}`,
        description: `18-carat pure gold accessory with signature details. Handcrafted and exclusively cataloged.`,
        price: Math.floor(Math.random() * 2500) + 1200,
        discount_percent: 0,
        category_id: catMap["luxury"],
        brand_id: brandMap["gucci-accessories"] || brandMap["gucci"] || null,
        images: [imgs.luxury[i % imgs.luxury.length]],
        stock: 5,
        rating: 4.9,
        review_count: 8,
        featured: true,
        colors: ["Gold"],
        sizes: ["One Size"],
      });
    }

    // ─── Insert products ─────────────────────────────────────────────────────────
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`✓ ${products.length} products seeded`);

    // ─── Admin user ──────────────────────────────────────────────────────────────
    const adminExists = await User.findOne({ email: "admin@nexstore.com" });
    if (!adminExists) {
      await User.create({
        display_name: "Admin Store",
        email: "admin@nexstore.com",
        password: "admin123",
        role: "admin",
      });
      console.log("✓ Admin user seeded (email: admin@nexstore.com, password: admin123)");
    }

    console.log("✅ Auto-seed complete!");
  } catch (err) {
    console.error("Auto-seed error:", err.message);
    // Don't crash the server — just log
  }
};
