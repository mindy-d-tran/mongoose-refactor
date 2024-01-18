import express from "express";
import Grade from "../models/grades.js";
// import { ObjectId } from "mongodb";
// import db from "../db/conn.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const grades = await Grade.find({}).limit(5);
  res.status(200).json(grades);
});
// Create a single grade entry
router.post("/", async (req, res) => {
  const newDocument = req.body;
  console.log(newDocument);

  if (newDocument.student_id) {
    newDocument.learner_id = newDocument.student_id;
    delete newDocument.student_id;
  }

  // const result = await collection.insertOne(newDocument);
  const result = await Grade.create(newDocument);
  res.send(result).status(204);
});

// Get a single grade entry
router.get("/:id", async (req, res) => {
  try {
    let result = await Grade.findById(req.params.id);
    res.send(result);
  } catch {
    res.send("Invalid ID").status(400);
  }
});

// Add a score to a grade entry
router.patch("/:id/add", async (req, res) => {
  let query = { _id: req.params.id };

  try {
    let result = await Grade.updateOne(query, {
      $push: { scores: req.body },
    });
    res.send(result);
  } catch {
    res.send("Invalid ID").status(400);
  }
});

// Remove a score from a grade entry
router.patch("/:id/remove", async (req, res) => {
  let query = { _id: req.params.id };
  try {
    let result = await Grade.updateOne(query, {
      $pull: { scores: req.body },
    });
    res.send(result).status(200);
  } catch {
    res.send("Invalid Grade ID").status(400);
  }
});

// Delete a single grade entry
router.delete("/:id", async (req, res) => {
  try {
    let result = await Grade.deleteOne({ _id: req.params.id });

    if (result) res.send(result);
    else res.send("Not found").status(404);
  } catch {
    res.send("Invalid ID").status(400);
  }
});

// Get route for backwards compatibility
router.get("/student/:id", async (req, res) => {
  res.redirect(`/api/grades/learner/${req.params.id}`);
});

// Get a learner's grade data
router.get("/learner/:id", async (req, res) => {
  try {
    let result = await Grade.find({ learner_id: Number(req.params.id) });
    res.send(result);
  } catch {
    res.send("Invalid Learner ID").status(400);
  }
});

// Delete a learner's grade data
router.delete("/learner/:id", async (req, res) => {
  try {
    let result = await Grade.deleteOne({ learner_id: Number(req.params.id) });
    res.send(result);
  } catch {
    res.send("Invalid Learner ID").status(400);
  }
});

// Get a class's grade data
router.get("/class/:id", async (req, res) => {
  try {
    let result = await Grade.find({ class_id: Number(req.params.id) });
    res.send(result);
  } catch {
    res.send("Invalid Class ID").status(400);
  }
});

// Update a class id
router.patch("/class/:id", async (req, res) => {
  try {
    let result = await Grade.updateMany(
      { class_id: Number(req.params.id) },
      { $set: { class_id: Number(req.body.class_id) } }
    );
    res.send(result);
  } catch {
    res.send("Invalid Class ID").status(400);
  }
});

// Delete a class
router.delete("/class/:id", async (req, res) => {
  try {
    let result = await Grade.deleteMany({ class_id: Number(req.params.id) });
    res.send(result).status(200);
  } catch {
    res.send("Not found").status(404);
  }
});

export default router;
