const express = require("express");
const { sendNotification } = require("../services/notificationService");
const User = require("../models/User");
// const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

// ===============================
// REGISTER FCM TOKEN
// ===============================
router.post("/register-token", protect, async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "FCM token is required",
      });
    }

    const user = req.user;

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.fcmTokens.includes(token)) {
      user.fcmTokens.push(token);
      await user.save();
    }

    return res.status(200).json({
      message: "FCM token registered successfully",
      fcmTokens: user.fcmTokens,
    });
  } catch (error) {
    console.error("FCM Token Registration Error:", error);

    return res.status(500).json({
      message: "Failed to register FCM token",
      error: error.message,
    });
  }
});

router.post("/send", async (req, res) => {
  try {
    const { token, title, body } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "FCM token is required",
      });
    }

    const response = await sendNotification({
      token,
      title: title || "E-Commerce App",
      body: body || "You have a new notification.",
    });

    return res.status(200).json({
      message: "Notification sent successfully",
      response,
    });
  } catch (error) {
    console.error("Send Notification Error:", error);

    return res.status(500).json({
      message: "Failed to send notification",
      error: error.message,
    });
  }
});

module.exports = router;