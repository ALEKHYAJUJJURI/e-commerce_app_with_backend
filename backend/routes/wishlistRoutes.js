const express = require("express");
const Wishlist = require("../models/Wishlist");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

//
// Add to Wishlist
//
router.post("/", protect, async (req, res) => {
  try {
    const { productId } = req.body;
console.log("req.user:", req.user);
    const exists = await Wishlist.findOne({
      user: req.user._id,
      product: productId,
    });

    if (exists) {
      return res.status(400).json({
        message: "Already in wishlist",
      });
    }

    const wishlist = await Wishlist.create({
      user: req.user._id,
      product: productId,
    });

    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//
// Get Wishlist
//
router.get("/", protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.user._id,
    }).populate("product");

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//
// Remove Wishlist Item
//
router.delete("/:productId", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    const deleted = await Wishlist.deleteOne({
      user: userId,
      product: productId,
    });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({
        message: "Item not found in wishlist",
      });
    }

    res.json({
      message: "Removed from wishlist",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;