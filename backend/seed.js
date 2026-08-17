const mongoose = require("mongoose");
const Product = require("./models/Product"); // Change this if your model path is different
const products = require("./products.json");

mongoose.connect("mongodb://127.0.0.1:27017/e-commerce");

const seedDB = async () => {
  try {
    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log(`${products.length} products inserted successfully!`);
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();