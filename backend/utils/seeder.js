import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";
import connectDB from "../config/db.js";

dotenv.config();

// Ensure we connect to database
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/nexstore");
    console.log("Connected to database for seeding...");

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();

    console.log("Data cleared...");

    // Seed Categories
    const categoriesData = [
      { name: "Clothing", slug: "clothing", description: "Premium apparel and clothing" },
      { name: "Shoes", slug: "shoes", description: "Iconic footwear and sneakers" },
      { name: "Watches", slug: "watches", description: "Time, luxury, and technology reimagined" },
      { name: "Electronics", slug: "electronics", description: "Next-gen personal tech and gadgets" },
      { name: "Accessories", slug: "accessories", description: "Defining details and luxury bags" },
      { name: "Sports", slug: "sports", description: "Athletic wear and sports equipment" },
      { name: "Luxury Items", slug: "luxury", description: "Exclusive luxury accessories and collectibles" },
    ];
    const categories = await Category.insertMany(categoriesData);
    console.log("Categories seeded...");

    // Map categories by slug for easy lookup
    const catMap = {};
    categories.forEach(c => { catMap[c.slug] = c._id; });

    // Seed Brands
    const brandsData = [
      // Clothing Category
      { name: "Nike", slug: "nike", category_id: catMap["clothing"], logo_url: "" },
      { name: "Adidas", slug: "adidas", category_id: catMap["clothing"], logo_url: "" },
      { name: "Puma", slug: "puma", category_id: catMap["clothing"], logo_url: "" },
      { name: "Zara", slug: "zara", category_id: catMap["clothing"], logo_url: "" },
      { name: "H&M", slug: "hm", category_id: catMap["clothing"], logo_url: "" },
      { name: "Gucci", slug: "gucci", category_id: catMap["clothing"], logo_url: "" },
      { name: "Levi's", slug: "levis", category_id: catMap["clothing"], logo_url: "" },
      { name: "Uniqlo", slug: "uniqlo", category_id: catMap["clothing"], logo_url: "" },
      { name: "Tommy Hilfiger", slug: "tommy-hilfiger", category_id: catMap["clothing"], logo_url: "" },
      { name: "Prada", slug: "prada", category_id: catMap["clothing"], logo_url: "" },
      { name: "Calvin Klein", slug: "calvin-klein", category_id: catMap["clothing"], logo_url: "" },
      { name: "Lacoste", slug: "lacoste", category_id: catMap["clothing"], logo_url: "" },
      { name: "Ralph Lauren", slug: "ralph-lauren", category_id: catMap["clothing"], logo_url: "" },

      // Shoes Category
      { name: "Nike", slug: "nike-shoes", category_id: catMap["shoes"], logo_url: "" },
      { name: "Adidas", slug: "adidas-shoes", category_id: catMap["shoes"], logo_url: "" },
      { name: "Puma", slug: "puma-shoes", category_id: catMap["shoes"], logo_url: "" },
      { name: "New Balance", slug: "new-balance", category_id: catMap["shoes"], logo_url: "" },
      { name: "Reebok", slug: "reebok", category_id: catMap["shoes"], logo_url: "" },
      { name: "Converse", slug: "converse", category_id: catMap["shoes"], logo_url: "" },
      { name: "Vans", slug: "vans", category_id: catMap["shoes"], logo_url: "" },
      { name: "Skechers", slug: "skechers", category_id: catMap["shoes"], logo_url: "" },
      { name: "Gucci", slug: "gucci-shoes", category_id: catMap["shoes"], logo_url: "" },
      { name: "Prada", slug: "prada-shoes", category_id: catMap["shoes"], logo_url: "" },
      { name: "Asics", slug: "asics", category_id: catMap["shoes"], logo_url: "" },
      { name: "Under Armour", slug: "under-armour-shoes", category_id: catMap["shoes"], logo_url: "" },

      // Watches Category
      { name: "Rolex", slug: "rolex", category_id: catMap["watches"], logo_url: "" },
      { name: "Casio", slug: "casio", category_id: catMap["watches"], logo_url: "" },
      { name: "Seiko", slug: "seiko", category_id: catMap["watches"], logo_url: "" },
      { name: "Tissot", slug: "tissot", category_id: catMap["watches"], logo_url: "" },
      { name: "Fossil", slug: "fossil", category_id: catMap["watches"], logo_url: "" },
      { name: "Omega", slug: "omega", category_id: catMap["watches"], logo_url: "" },
      { name: "Tag Heuer", slug: "tag-heuer", category_id: catMap["watches"], logo_url: "" },
      { name: "Apple", slug: "apple-watches", category_id: catMap["watches"], logo_url: "" },
      { name: "Citizen", slug: "citizen", category_id: catMap["watches"], logo_url: "" },

      // Electronics Category
      { name: "Apple", slug: "apple", category_id: catMap["electronics"], logo_url: "" },
      { name: "Samsung", slug: "samsung", category_id: catMap["electronics"], logo_url: "" },
      { name: "Sony", slug: "sony", category_id: catMap["electronics"], logo_url: "" },
      { name: "Dell", slug: "dell", category_id: catMap["electronics"], logo_url: "" },
      { name: "HP", slug: "hp", category_id: catMap["electronics"], logo_url: "" },
      { name: "Lenovo", slug: "lenovo", category_id: catMap["electronics"], logo_url: "" },
      { name: "Asus", slug: "asus", category_id: catMap["electronics"], logo_url: "" },
      { name: "Acer", slug: "acer", category_id: catMap["electronics"], logo_url: "" },
      { name: "Microsoft", slug: "microsoft", category_id: catMap["electronics"], logo_url: "" },
      { name: "Bose", slug: "bose", category_id: catMap["electronics"], logo_url: "" },
      { name: "LG", slug: "lg", category_id: catMap["electronics"], logo_url: "" },

      // Accessories Category
      { name: "Gucci", slug: "gucci-accessories", category_id: catMap["accessories"], logo_url: "" },
      { name: "Louis Vuitton", slug: "louis-vuitton", category_id: catMap["accessories"], logo_url: "" },
      { name: "Ray-Ban", slug: "rayban", category_id: catMap["accessories"], logo_url: "" },
      { name: "Michael Kors", slug: "michael-kors", category_id: catMap["accessories"], logo_url: "" },
      { name: "Coach", slug: "coach", category_id: catMap["accessories"], logo_url: "" },
      { name: "Prada", slug: "prada-accessories", category_id: catMap["accessories"], logo_url: "" },

      // Sports Category
      { name: "Nike", slug: "nike-sports", category_id: catMap["sports"], logo_url: "" },
      { name: "Adidas", slug: "adidas-sports", category_id: catMap["sports"], logo_url: "" },
      { name: "Puma", slug: "puma-sports", category_id: catMap["sports"], logo_url: "" },
      { name: "Under Armour", slug: "under-armour", category_id: catMap["sports"], logo_url: "" },
      { name: "Wilson", slug: "wilson", category_id: catMap["sports"], logo_url: "" },
      { name: "Yonex", slug: "yonex", category_id: catMap["sports"], logo_url: "" },
      { name: "Decathlon", slug: "decathlon", category_id: catMap["sports"], logo_url: "" }
    ];
    const brands = await Brand.insertMany(brandsData);
    console.log("Brands seeded...");

    const brandMap = {};
    brands.forEach(b => { brandMap[b.slug] = b._id; });

    // Create Admin and Standard User
    const admin = await User.create({
      display_name: "Admin Store",
      email: "admin@nexstore.com",
      password: "admin123", // Will be hashed by pre-save hook
      role: "admin",
    });

    const standardUser = await User.create({
      display_name: "Jane Doe",
      email: "user@nexstore.com",
      password: "user123", // Will be hashed
      role: "user",
    });

    console.log("Users seeded...");

    // Pre-defined high-quality Unsplash image URLs for product pools
    const imagesPool = {
      clothing: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&auto=format&fit=crop&q=80"
      ],
      shoes: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=80"
      ],
      watches: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1619134778706-7015533a6150?w=500&auto=format&fit=crop&q=80"
      ],
      electronics: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500&auto=format&fit=crop&q=80"
      ],
      accessories: [
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=80"
      ],
      sports: [
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&auto=format&fit=crop&q=80"
      ],
      luxury: [
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=500&auto=format&fit=crop&q=80"
      ]
    };

    const products = [];

    // Helper to generate clothing
    const clothingTypes = ["Sweatshirt", "Comfort Chino", "Athletic Tee", "Denim Jacket", "Linen Shirt", "Slim Fit Suit", "Parka Coat", "Knit Sweater", "Track Jacket", "Cargo Pants"];
    const clothingBrands = ["nike", "adidas", "gucci", "zara", "prada", "levis", "hm"];
    const colors = ["Black", "White", "Navy", "Red", "Heather Grey", "Olive Green", "Beige", "Gold"];
    const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL"];

    for (let i = 1; i <= 55; i++) {
      const bSlug = clothingBrands[i % clothingBrands.length];
      const type = clothingTypes[i % clothingTypes.length];
      const brandName = bSlug.charAt(0).toUpperCase() + bSlug.slice(1);
      const name = `${brandName} ${type} v${i}`;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      products.push({
        name,
        slug,
        description: `Premium quality ${brandName} ${type.toLowerCase()} designed for ultimate style and comfort. Breathable fabric and perfect fit.`,
        price: Math.floor(Math.random() * 220) + 29,
        discount_percent: Math.random() > 0.5 ? Math.floor(Math.random() * 40) + 10 : 0,
        category_id: catMap["clothing"],
        brand_id: brandMap[bSlug],
        images: [imagesPool.clothing[i % imagesPool.clothing.length]],
        stock: Math.floor(Math.random() * 100) + 5,
        rating: +(Math.random() * 1.5 + 3.5).toFixed(1),
        review_count: Math.floor(Math.random() * 80) + 2,
        featured: i <= 4, // Make first few featured
        colors: [colors[i % colors.length], colors[(i + 1) % colors.length]],
        sizes: clothingSizes.slice(i % 3, 4 + (i % 3)),
      });
    }

    // Helper to generate shoes
    const shoeTypes = ["Air Max Sneaker", "Ultraboost Runner", "Street Trainer", "Speed Knit Sneaker", "Leather Oxford", "Trail Boot", "Casual Loafer", "Active Sandal", "Retro Court Sneaker"];
    const shoeBrands = ["nike", "adidas", "prada", "gucci", "puma"];
    const shoeSizes = ["7", "8", "9", "10", "11", "12"];

    for (let i = 1; i <= 52; i++) {
      const bSlug = shoeBrands[i % shoeBrands.length];
      const type = shoeTypes[i % shoeTypes.length];
      const brandName = bSlug.charAt(0).toUpperCase() + bSlug.slice(1);
      const name = `${brandName} ${type} ${i + 100}`;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      products.push({
        name,
        slug,
        description: `Step into the future of footwear. Engineered with responsive cushioning and sleek premium aesthetics.`,
        price: Math.floor(Math.random() * 350) + 80,
        discount_percent: Math.random() > 0.6 ? Math.floor(Math.random() * 30) + 10 : 0,
        category_id: catMap["shoes"],
        brand_id: brandMap[bSlug + "-shoes"] || brandMap[bSlug],
        images: [imagesPool.shoes[i % imagesPool.shoes.length]],
        stock: Math.floor(Math.random() * 60) + 3,
        rating: +(Math.random() * 1.3 + 3.7).toFixed(1),
        review_count: Math.floor(Math.random() * 120) + 5,
        featured: i <= 4,
        colors: [colors[i % colors.length], "Gold"],
        sizes: shoeSizes.slice(i % 2, 4 + (i % 2)),
      });
    }

    // Helper to generate watches
    const watchTypes = ["Submariner Luxury", "Speedmaster Chrono", "Heritage Automatic", "Vintage Digital", "Smartwatch Active", "Mechanical Diver", "Minimalist Quartz"];
    const watchBrands = ["rolex", "casio", "seiko", "apple", "tagy"]; // we will map tagy to rolex if missing
    
    for (let i = 1; i <= 32; i++) {
      const bSlug = watchBrands[i % watchBrands.length] === "tagy" ? "rolex" : watchBrands[i % watchBrands.length];
      const type = watchTypes[i % watchTypes.length];
      const brandName = bSlug.charAt(0).toUpperCase() + bSlug.slice(1);
      const name = `${brandName} ${type} Series ${i}`;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      products.push({
        name,
        slug,
        description: `A masterclass in precision. Crafted from marine-grade alloys, offering waterproof reliability and elegant detail.`,
        price: Math.floor(Math.random() * 9500) + 99,
        discount_percent: Math.random() > 0.8 ? Math.floor(Math.random() * 15) + 5 : 0,
        category_id: catMap["watches"],
        brand_id: brandMap[bSlug + "-watches"] || brandMap[bSlug] || brandMap["rolex"],
        images: [imagesPool.watches[i % imagesPool.watches.length]],
        stock: Math.floor(Math.random() * 20) + 2,
        rating: +(Math.random() * 0.9 + 4.1).toFixed(1),
        review_count: Math.floor(Math.random() * 50) + 1,
        featured: i <= 3,
        colors: ["Gold", "Silver", "Space Black"],
        sizes: ["One Size"],
      });
    }

    // Helper to generate electronics
    const elecTypes = ["Noise Cancelling Headphones", "Pro Wireless Earbuds", "Ultra Phone", "Portable Soundbar", "Super AMOLED Tablet", "Slim Laptop Pro", "Mechanical Keyboard", "Bluetooth Speaker"];
    const elecBrands = ["apple", "sony", "bose", "adidas", "samsung"];

    for (let i = 1; i <= 55; i++) {
      const bSlug = elecBrands[i % elecBrands.length];
      const type = elecTypes[i % elecTypes.length];
      const brandName = bSlug.charAt(0).toUpperCase() + bSlug.slice(1);
      const name = `${brandName} ${type} X${i}`;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      products.push({
        name,
        slug,
        description: `Equipped with state-of-the-art processors, rich acoustics, and high definition visuals. Built for comfort and seamless daily use.`,
        price: Math.floor(Math.random() * 1400) + 49,
        discount_percent: Math.random() > 0.4 ? Math.floor(Math.random() * 35) + 5 : 0,
        category_id: catMap["electronics"],
        brand_id: brandMap[bSlug + "-electronics"] || brandMap[bSlug] || brandMap["sony"],
        images: [imagesPool.electronics[i % imagesPool.electronics.length]],
        stock: Math.floor(Math.random() * 150) + 10,
        rating: +(Math.random() * 1.1 + 3.9).toFixed(1),
        review_count: Math.floor(Math.random() * 300) + 12,
        featured: i <= 4,
        colors: ["Graphite", "Silver", "Gold", "Midnight Black"],
        sizes: ["Standard"],
      });
    }

    // Helper to generate accessories
    const accTypes = ["Classic Aviator Sunglasses", "Luxury Leather Belt", "Monogram Wallet", "Silk Scarf", "Travel Duffel Bag", "Premium Backpack", "Wool Fedora Hat"];
    const accBrands = ["gucci", "prada", "rayban"];

    for (let i = 1; i <= 25; i++) {
      const bSlug = accBrands[i % accBrands.length];
      const type = accTypes[i % accTypes.length];
      const brandName = bSlug === "rayban" ? "Ray-Ban" : bSlug.charAt(0).toUpperCase() + bSlug.slice(1);
      const name = `${brandName} ${type} v${i}`;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      products.push({
        name,
        slug,
        description: `Elevate your lifestyle. Made with curated components and dynamic styling, adding the perfect finishing touches.`,
        price: Math.floor(Math.random() * 550) + 35,
        discount_percent: Math.random() > 0.7 ? Math.floor(Math.random() * 25) + 5 : 0,
        category_id: catMap["accessories"],
        brand_id: brandMap[bSlug + "-accessories"] || brandMap[bSlug] || brandMap["gucci"],
        images: [imagesPool.accessories[i % imagesPool.accessories.length]],
        stock: Math.floor(Math.random() * 40) + 5,
        rating: +(Math.random() * 1.2 + 3.8).toFixed(1),
        review_count: Math.floor(Math.random() * 70) + 2,
        featured: i <= 2,
        colors: ["Black", "Brown", "Gold"],
        sizes: ["Standard"],
      });
    }

    // Add some sports
    for (let i = 1; i <= 10; i++) {
      const name = `Nike Sports Fit Pack ${i}`;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      products.push({
        name,
        slug,
        description: `High performance athletic gear. Built with sweat-wicking materials to optimize your training routines.`,
        price: Math.floor(Math.random() * 150) + 30,
        discount_percent: 0,
        category_id: catMap["sports"],
        brand_id: brandMap["nike-sports"] || brandMap["nike"],
        images: [imagesPool.sports[i % imagesPool.sports.length]],
        stock: 35,
        rating: 4.5,
        review_count: 15,
        featured: false,
        colors: ["Neon Green", "Slate Black"],
        sizes: ["S", "M", "L", "XL"],
      });
    }

    // Add some luxury items
    for (let i = 1; i <= 10; i++) {
      const name = `Gucci Imperial Gold Ring ${i}`;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      products.push({
        name,
        slug,
        description: `18-carat pure gold accessory with signature details. Handcrafted and exclusively cataloged.`,
        price: Math.floor(Math.random() * 2500) + 1200,
        discount_percent: 0,
        category_id: catMap["luxury"],
        brand_id: brandMap["gucci-accessories"] || brandMap["gucci"],
        images: [imagesPool.luxury[i % imagesPool.luxury.length]],
        stock: 5,
        rating: 4.9,
        review_count: 8,
        featured: true,
        colors: ["Gold"],
        sizes: ["One Size"],
      });
    }

    // Insert all generated products
    await Product.insertMany(products);
    console.log(`Successfully seeded ${products.length} products!`);

    mongoose.connection.close();
    console.log("Seeding complete. Connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
