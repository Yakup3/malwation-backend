const express = require("express");
const { z } = require("zod");
const { getDatabase } = require("../db");
const authenticate = require("../middleware/authenticate");
const { ObjectId } = require("mongodb");

const router = express.Router();

const collectionName = "user-list";

router.get("/", authenticate, async (req, res) => {
  try {
    const db = getDatabase();
    const users = await db.collection(collectionName).find().toArray();
    res.status(200).json({ users, success: true });
  } catch (error) {
    console.error("List Users error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new ObjectId(id);

    const db = getDatabase();
    const user = await db.collection(collectionName).findOne({ _id: objectId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user, success: true });
  } catch (error) {
    console.error("Get User by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, active } = req.body;

    const schema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string(),
      role: z.string(),
      active: z.boolean(),
    });

    const validatedData = schema.parse({ name, email, phone, role, active });
    const objectId = new ObjectId(id);

    const db = getDatabase();
    const result = await db
      .collection(collectionName)
      .updateOne({ _id: objectId }, { $set: validatedData });

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", success: true });
  } catch (error) {
    console.error("Update User error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/delete/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const db = getDatabase();
    const objectId = new ObjectId(id);
    const result = await db
      .collection(collectionName)
      .deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    res
      .status(200)
      .json({ message: "User deleted successfully", success: true });
  } catch (error) {
    console.error("Delete User error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
