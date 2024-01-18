import express from "express";
import { ObjectId } from "mongodb";
import db from "../db/conn.js";

const router = express.Router();

router.get("/", async (req, res) => {
  let collection = await db.collection("grades");
  if (req.query.class_id && req.query.learner_id) {
    let query = {
      class_id: Number(req.query.class_id),
      learner_id: Number(req.query.learner_id),
    };
    let result = await collection.find(query).toArray();

    if (!result) res.status(404).send("not found");
    else res.send(result);
    return;
  }
  let result = await collection.find();
  res.send(result);
});
router.post("/", async (req, res) => {
  let collection = await db.collection("grades");
  let newDocument = req.body;

  // rename fields for backwards compatibility
  if (newDocument.student_id) {
    newDocument.learner_id = newDocument.student_id;
    delete newDocument.student_id;
  }
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204); /**send needs to be before status */
});
// GET /grade/:id
router.get("/:id", async (req, res) => {
  const collection = await db.collection("grades");

  const query = { _id: new ObjectId(req.params.id) };

  const result = await collection.findOne(query);

  if (!result) res.status(404).send("Not found");
  else res.send(result).status(200);
});
// delete single grade entry
router.delete("/:id", async (req, res) => {
  const collection = await db.collection("grades");

  const query = { _id: new ObjectId(req.params.id) };

  const result = await collection.deleteOne(query);

  if (!result) res.status(404).send("Not found");
  else res.send(result).status(200);
});

// get redirect to /learner/:id
router.get("/student/:id", async (req, res) =>
  res.redirect(`/grades/learner/${req.params.id}`)
);
// Get a learner's grade data
router.get("/learner/:id", async (req, res) => {
  let collection = await db.collection("grades");
  let query = { learner_id: Number(req.params.id) };
  let result = await collection.find(query).toArray();

  if (!result.length) res.status(404).send("Not found");
  /**status needs to be before send to change the status */ else
    res.send(result).status(200);
});
// delete all instances of that learner/:id
router.delete("/learner/:id", async (req, res, next) => {
  let collection = await db.collection("grades");
  let query = { learner_id: Number(req.params.id) };
  let result = await collection.deleteMany(query);

  if (!result) next();
  else res.status(200).send(result);
});

// Get a class's grade data
router.get("/class/:id", async (req, res) => {
  let collection = await db.collection("grades");
  let query = { class_id: Number(req.params.id) };
  let result = await collection.find(query).toArray();

  if (!result.length) res.status(404).send("Not found");
  /**status needs to be before send to change the status */ else
    res.send(result).status(200);
});
router.patch("/class/:id", async (req, res, next) => {
  let collection = await db.collection("grades");
  let query = { class_id: Number(req.params.id) };

  // only does it if body contains .class_id will make class_id "NaN" if it's not there
  if (req.body.class_id) {
    // remember to convert it to number or else it will be a string
    let result = await collection.updateMany(query, {
      $set: { class_id: Number(req.body.class_id) },
    });
    res.send(result);
  } else next();
});
router.delete("/class/:id", async (req, res, next) => {
  let collection = await db.collection("grades");
  let query = { class_id: Number(req.params.id) };
  let result = await collection.deleteMany(query);

  if (!result) next();
  else res.status(200).send(result);
});

router.get("/class/:class_id/learner/:learner_id", async (req, res) => {
  let collection = await db.collection("grades");
  let query = {
    class_id: Number(req.params.class_id),
    learner_id: Number(req.params.learner_id),
  };
  let result = await collection.find(query).toArray();

  if (!result) res.status(404).send("not found");
  else res.status(200).send(result);
});
router.patch("/class/:class_id/learner/:learner_id", async (req, res, next) => {
  let collection = await db.collection("grades");
  let query = {
    class_id: Number(req.params.class_id),
    learner_id: Number(req.params.learner_id),
  };
  for (const key in req.body) {
    switch (key) {
      case "add":
        await collection.updateOne(query, {
          $push: { scores: req.body[key] },
        });
        break;
      // case "remove":
      //   await collection.updateOne(query, {
      //     $pull: { scores: {score: req.body[key]} },
      //   });
      default:
        break;
    }
  }
  // if (req.body.add) {
  //   let result = await collection.updateOne(query, {
  //     $push: { scores: req.body.add },
  //   });
  //   res.send(result);
  // } else next();
});

export default router;
