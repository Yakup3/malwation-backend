const { z } = require("zod");
const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const { getDatabase } = require("../db");

const router = express.Router();
const collectionName = "users";

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const validatedData = schema.parse({ email, password });

    const db = getDatabase();
    const existingUser = await db
      .collection(collectionName)
      .findOne({ email: validatedData.email });
    if (existingUser) {
      return res.json({ message: "Email already registered", success: false });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newUser = { email: validatedData.email, password: hashedPassword };
    const result = await db.collection(collectionName).insertOne(newUser);

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertedId,
      success: true,
    });
  } catch (error) {
    console.error("User registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const validatedData = schema.parse({ email, password });

    const db = getDatabase();
    const user = await db
      .collection(collectionName)
      .findOne({ email: validatedData.email });
    if (!user) {
      return res.json({ message: "Invalid email or password", success: false });
    }

    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.json({ message: "Invalid email or password", success: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({
      message: "Login successful",
      token,
      success: true,
      email: user.email,
    });
  } catch (error) {
    console.error("User login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
