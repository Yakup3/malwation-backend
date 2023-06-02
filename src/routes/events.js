const { z } = require("zod");
const express = require("express");
const { ObjectId } = require("mongodb");
const { getDatabase } = require("../db");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

const collectionName = "events";

router.post("/create", authenticate, async (req, res) => {
  try {
    const { eventName, eventDate, eventLocation, eventDescription } = req.body;

    const schema = z.object({
      eventName: z.string().nonempty(),
      eventDate: z.string().nonempty(),
      eventLocation: z.string().nonempty(),
      eventDescription: z.string().nonempty(),
    });

    const validatedData = schema.parse(req.body);

    const newEvent = {
      eventName: validatedData.eventName,
      eventDate: validatedData.eventDate,
      eventLocation: validatedData.eventLocation,
      eventDescription: validatedData.eventDescription,
    };

    const db = getDatabase();
    const result = await db.collection(collectionName).insertOne(newEvent);

    res.status(201).json({
      message: "Event created successfully",
      eventId: result.insertedId,
      success: true,
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update/:id", authenticate, async (req, res) => {
  try {
    const eventId = req.params.id;
    const { eventName, eventDate, eventLocation, eventDescription } = req.body;

    const schema = z.object({
      eventName: z.string().nonempty(),
      eventDate: z.string().nonempty(),
      eventLocation: z.string().nonempty(),
      eventDescription: z.string().nonempty(),
    });

    const validatedData = schema.parse(req.body);

    const db = getDatabase();
    const objectId = new ObjectId(eventId);
    const result = await db.collection(collectionName).updateOne(
      { _id: objectId },
      {
        $set: {
          eventName: validatedData.eventName,
          eventDate: validatedData.eventDate,
          eventLocation: validatedData.eventLocation,
          eventDescription: validatedData.eventDescription,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res
      .status(200)
      .json({ message: "Event updated successfully", success: true });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const eventId = req.params.id;

    const db = getDatabase();
    const objectId = new ObjectId(eventId);
    const event = await db
      .collection(collectionName)
      .findOne({ _id: objectId });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ event });
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const eventId = req.params.id;

    const db = getDatabase();
    const objectId = new ObjectId(eventId);
    const result = await db
      .collection(collectionName)
      .deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res
      .status(200)
      .json({ message: "Event deleted successfully", success: true });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", authenticate, async (req, res) => {
  try {
    const { date } = req.query;
    const query = date ? { eventDate: { $gte: new Date(date) } } : {};

    const db = getDatabase();
    const events = await db.collection(collectionName).find(query).toArray();

    res.status(200).json({ events, success: true });
  } catch (error) {
    console.error("List events error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
