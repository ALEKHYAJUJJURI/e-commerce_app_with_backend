const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();
// const firebaseAuth = require("../config/firebaseAdmin");

const { firebaseAuth } = require("../config/firebaseAdmin");
//
// REGISTER
//
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created",
      user,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

//
// LOGIN
//
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Google users may not have a password
    if (!user.password) {
      return res.status(400).json({
        message:
          "This account uses Google Sign-In. Please continue with Google.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// GOOGLE LOGIN
//
router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message: "Firebase ID token is required",
      });
    }

    // Verify Firebase ID token
    const decodedToken =
      await firebaseAuth.verifyIdToken(idToken);

    const {
      uid,
      email,
      name,
      picture,
    } = decodedToken;

    if (!email) {
      return res.status(400).json({
        message: "Google account email not found",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    // Create new user
    if (!user) {
      user = await User.create({
        name: name || "Google User",
        email,
        firebaseUid: uid,
        profileImage: picture || "",
        authProvider: "google",
      });
    } else {
      // Update Google information if existing user
      user.firebaseUid = uid;
      user.authProvider = "google";

      if (picture) {
        user.profileImage = picture;
      }

      if (!user.name && name) {
        user.name = name;
      }

      await user.save();
    }

    // Create YOUR application JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Google login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Google Login Error:", error);

    return res.status(401).json({
      message: "Google authentication failed",
    });
  }
});



module.exports = router;