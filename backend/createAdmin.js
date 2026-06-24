require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const hashedPassword = await bcrypt.hash(
      "admin123",
      10
    );

    await User.create({
      name: "Admin1",
      email: "admin1@shop.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin Created");

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

createAdmin();