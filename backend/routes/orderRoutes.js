const express = require("express");
const Order = require("../models/Order");
const protect = require("../middleware/authMiddleware");
const { sendNotification } = require("../services/notificationService");
const router = express.Router();

//
// PLACE ORDER
//
router.post("/", protect, async (req, res) => {
  try {
    const { products, totalAmount } = req.body;

    const order = await Order.create({
      user: req.user.id,
      products,
      totalAmount,
      status: "Pending",
    });

    // Send order placed notification
    if (req.user.fcmTokens && req.user.fcmTokens.length > 0) {
      for (const token of req.user.fcmTokens) {
        try {
          await sendNotification({
            token,
            title: "Order Placed Successfully 🎉",
            body: `Your order #${order._id
              .toString()
              .slice(-8)
              .toUpperCase()} has been placed successfully.`,
            data: {
              type: "ORDER_PLACED",
              orderId: order._id.toString(),
            },
          });
        } catch (notificationError) {
          console.log(
            "Notification failed:",
            notificationError.message
          );
        }
      }
    }

    res.status(201).json(order);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

//
// GET MY ORDERS
//
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("products.product")
      .sort({
        createdAt: -1,
      });

    res.json(orders);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

//
// GET SINGLE ORDER
//
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    ).populate("products.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;