import mongoose from "mongoose"
import dotenv from "dotenv"
import Product from "../models/Product.js"
import AdminUser from "../models/AdminUser.js"
import Order from "../models/Order.js"

dotenv.config()

const products = [
  {
    name: "Wireless Bluetooth Headphones",
    description:
      "High-quality wireless headphones with noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.",
    price: 4999,
    stock: 50,
    category: "Electronics",
    status: "Active",
    imageUrl: "/wireless-headphones.png",
  },
  {
    name: "Organic Cotton Kurta",
    description:
      "Comfortable and sustainable organic cotton kurta. Available in multiple sizes. Soft, breathable fabric perfect for everyday wear.",
    price: 1299,
    stock: 100,
    category: "Clothing",
    status: "Active",
    imageUrl: "/cotton-tshirt.png",
  },
  {
    name: "Copper Water Bottle",
    description:
      "Traditional copper water bottle with health benefits. Keeps water naturally cool and pure. Ayurvedic recommended.",
    price: 899,
    stock: 75,
    category: "Home & Kitchen",
    status: "Active",
    imageUrl: "/steel-water-bottle.jpg",
  },
  {
    name: "Smart Fitness Watch",
    description:
      "Track your fitness goals with this advanced smartwatch. Features heart rate monitoring, GPS, sleep tracking, and 7-day battery life.",
    price: 7999,
    stock: 30,
    category: "Electronics",
    status: "Active",
    imageUrl: "/fitness-smartwatch.png",
  },
  {
    name: "Leather Laptop Bag",
    description:
      "Premium genuine leather laptop bag with multiple compartments. Fits laptops up to 15.6 inches. Professional and stylish design.",
    price: 3499,
    stock: 25,
    category: "Accessories",
    status: "Active",
    imageUrl: "/leather-laptop-bag.jpg",
  },
  {
    name: "Brass Chai Glass Set",
    description:
      "Set of 6 handcrafted brass chai glasses with traditional Indian design. Perfect for serving chai to guests.",
    price: 1599,
    stock: 60,
    category: "Home & Kitchen",
    status: "Active",
    imageUrl: "/ceramic-coffee-mugs.jpg",
  },
  {
    name: "Sports Running Shoes",
    description:
      "Lightweight running shoes with responsive cushioning and breathable mesh upper. Ideal for both casual runners and athletes.",
    price: 2999,
    stock: 45,
    category: "Footwear",
    status: "Active",
    imageUrl: "/running-shoes.jpg",
  },
  {
    name: "Premium Yoga Mat",
    description:
      "Extra thick yoga mat with non-slip surface. Perfect for yoga, pilates, and floor exercises. Includes carrying strap.",
    price: 1499,
    stock: 8,
    category: "Sports & Fitness",
    status: "Active",
    imageUrl: "/rolled-yoga-mat.png",
  },
  {
    name: "Wireless Phone Charger",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.",
    price: 999,
    stock: 120,
    category: "Electronics",
    status: "Active",
    imageUrl: "/wireless-charger.png",
  },
  {
    name: "Brass Diya Lamp Set",
    description:
      "Traditional brass diya lamp set for puja and festivals. Set of 5 beautifully crafted diyas. Perfect for Diwali.",
    price: 799,
    stock: 5,
    category: "Home & Kitchen",
    status: "Active",
    imageUrl: "/vintage-desk-lamp.jpg",
  },
  {
    name: "Discontinued Product",
    description: "This product is no longer available for sale.",
    price: 499,
    stock: 10,
    category: "Other",
    status: "Inactive",
    imageUrl: "/discontinued-product.jpg",
  },
  {
    name: "Bamboo Chopping Board",
    description: "Eco-friendly bamboo cutting board with juice groove. Durable and knife-friendly surface.",
    price: 699,
    stock: 40,
    category: "Home & Kitchen",
    status: "Active",
    imageUrl: "/bamboo-cutting-board.png",
  },
]

const adminUser = {
  email: "admin@desimart.com",
  password: "admin123",
  role: "superadmin",
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await Product.deleteMany({})
    await AdminUser.deleteMany({})
    await Order.deleteMany({})
    console.log("Cleared existing data")

    // Create products
    const createdProducts = await Product.insertMany(products)
    console.log(`Created ${createdProducts.length} products`)

    // Create admin user
    const admin = await AdminUser.create(adminUser)
    console.log(`Created admin user: ${admin.email}`)

    console.log("\n========================================")
    console.log("Database seeded successfully!")
    console.log("========================================")
    console.log("\nAdmin Login Credentials:")
    console.log(`Email: ${adminUser.email}`)
    console.log(`Password: ${adminUser.password}`)
    console.log("========================================\n")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
