const express = require("express");
const Product = require("../models/Product");
const upload = require("../middleware/upload");

const router = express.Router();

//
// GET ALL PRODUCTS
//
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//
// ADD PRODUCT
//
router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      const product = await Product.create({
        title: req.body.title,
        price: Number(req.body.price),
        description: req.body.description,
        category: req.body.category,
        image: req.file
          ? req.file.filename
          : "",
      });

      res.status(201).json(product);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


//
// UPDATE PRODUCT
//
router.put(
  "/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const updateData = {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
      };

      if (req.file) {
        updateData.image = req.file.filename;
      }

      const product =
        await Product.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );

      res.json(product);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

//
// DELETE PRODUCT
//
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});
module.exports = router;