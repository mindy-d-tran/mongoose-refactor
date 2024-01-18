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
  const newDoc = new Grade({
    scores: [req.body.scores],
    class_id: req.body.class_id,
    learner_id: req.body.learner_id || req.body.student_id,
  });

  let result = await newDoc.save();
  res.send(result).status(204);

  // let collection = await db.collection("grades");
  // let newDocument = req.body;

  // // rename fields for backwards compatibility
  // if (newDocument.student_id) {
  //   newDocument.learner_id = newDocument.student_id;
  //   delete newDocument.student_id;
  // }

  // let result = await collection.insertOne(newDocument);
  // res.send(result).status(204);
});

// Get a single grade entry
router.get("/:id", async (req, res) => {
  try {
    let result = await Grade.findById(req.params.id);
    res.send(result);
  } catch {
    res.send("Invalid ID").status(400);
  }
  // let collection = await db.collection("grades");
  // let query = { _id: ObjectId(req.params.id) };
  // let result = await collection.findOne(query);

  // if (!result) res.send("Not found").status(404);
  // else res.send(result).status(200);
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

// // Remove a score from a grade entry
// router.patch("/:id/remove", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { _id: ObjectId(req.params.id) };

//   let result = await collection.updateOne(query, {
//     $pull: { scores: req.body }
//   });

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

// // Delete a single grade entry
// router.delete("/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { _id: ObjectId(req.params.id) };
//   let result = await collection.deleteOne(query);

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

// Get route for backwards compatibility
router.get("/student/:id", async (req, res) => {
  res.redirect(`/api/grades/learner/${req.params.id}`);
});

// Get a learner's grade data
router.get("/learner/:id", async (req, res) => {
  try {
    let result = await Grade.find({learner_id: Number(req.params.id)});
    res.send(result);
  } catch {
    res.send("Invalid ID").status(400);
  }
  // let collection = await db.collection("grades");
  // let query = { learner_id: Number(req.params.id) };

  // // Check for class_id parameter
  // if (req.query.class) query.class_id = Number(req.query.class);

  // let result = await collection.find(query).toArray();

  // if (!result) res.send("Not found").status(404);
  // else res.send(result).status(200);
});

// // Delete a learner's grade data
// router.delete("/learner/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { learner_id: Number(req.params.id) };

//   let result = await collection.deleteOne(query);

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

// // Get a class's grade data
// router.get("/class/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { class_id: Number(req.params.id) };

//   // Check for learner_id parameter
//   if (req.query.learner) query.learner_id = Number(req.query.learner);

//   let result = await collection.find(query).toArray();

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

// // Update a class id
// router.patch("/class/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { class_id: Number(req.params.id) };

//   let result = await collection.updateMany(query, {
//     $set: { class_id: req.body.class_id }
//   });

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

// // Delete a class
// router.delete("/class/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { class_id: Number(req.params.id) };

//   let result = await collection.deleteMany(query);

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

// router.get("/", async (req, res) => {
//   let collection = await db.collection("grades");
//   if (req.query.class_id && req.query.learner_id) {
//     let query = {
//       class_id: Number(req.query.class_id),
//       learner_id: Number(req.query.learner_id),
//     };
//     let result = await collection.find(query).toArray();

//     if (!result) res.status(404).send("not found");
//     else res.send(result);
//     return;
//   }
//   let result = await collection.find();
//   res.send(result);
// });
// router.post("/", async (req, res) => {
//   let collection = await db.collection("grades");
//   let newDocument = req.body;

//   // rename fields for backwards compatibility
//   if (newDocument.student_id) {
//     newDocument.learner_id = newDocument.student_id;
//     delete newDocument.student_id;
//   }
//   let result = await collection.insertOne(newDocument);
//   res.send(result).status(204); /**send needs to be before status */
// });
// // GET /grade/:id
// router.get("/:id", async (req, res) => {
//   const collection = await db.collection("grades");

//   const query = { _id: new ObjectId(req.params.id) };

//   const result = await collection.findOne(query);

//   if (!result) res.status(404).send("Not found");
//   else res.send(result).status(200);
// });
// // delete single grade entry
// router.delete("/:id", async (req, res) => {
//   const collection = await db.collection("grades");

//   const query = { _id: new ObjectId(req.params.id) };

//   const result = await collection.deleteOne(query);

//   if (!result) res.status(404).send("Not found");
//   else res.send(result).status(200);
// });

// // get redirect to /learner/:id
// router.get("/student/:id", async (req, res) =>
//   res.redirect(`/grades/learner/${req.params.id}`)
// );
// // Get a learner's grade data
// router.get("/learner/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { learner_id: Number(req.params.id) };
//   let result = await collection.find(query).toArray();

//   if (!result.length) res.status(404).send("Not found");
//   /**status needs to be before send to change the status */ else
//     res.send(result).status(200);
// });
// // delete all instances of that learner/:id
// router.delete("/learner/:id", async (req, res, next) => {
//   let collection = await db.collection("grades");
//   let query = { learner_id: Number(req.params.id) };
//   let result = await collection.deleteMany(query);

//   if (!result) next();
//   else res.status(200).send(result);
// });

// // Get a class's grade data
// router.get("/class/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { class_id: Number(req.params.id) };
//   let result = await collection.find(query).toArray();

//   if (!result.length) res.status(404).send("Not found");
//   /**status needs to be before send to change the status */ else
//     res.send(result).status(200);
// });
// router.patch("/class/:id", async (req, res, next) => {
//   let collection = await db.collection("grades");
//   let query = { class_id: Number(req.params.id) };

//   // only does it if body contains .class_id will make class_id "NaN" if it's not there
//   if (req.body.class_id) {
//     // remember to convert it to number or else it will be a string
//     let result = await collection.updateMany(query, {
//       $set: { class_id: Number(req.body.class_id) },
//     });
//     res.send(result);
//   } else next();
// });
// router.delete("/class/:id", async (req, res, next) => {
//   let collection = await db.collection("grades");
//   let query = { class_id: Number(req.params.id) };
//   let result = await collection.deleteMany(query);

//   if (!result) next();
//   else res.status(200).send(result);
// });

// router.get("/class/:class_id/learner/:learner_id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = {
//     class_id: Number(req.params.class_id),
//     learner_id: Number(req.params.learner_id),
//   };
//   let result = await collection.find(query).toArray();

//   if (!result) res.status(404).send("not found");
//   else res.status(200).send(result);
// });
// router.patch("/class/:class_id/learner/:learner_id", async (req, res, next) => {
//   let collection = await db.collection("grades");
//   let query = {
//     class_id: Number(req.params.class_id),
//     learner_id: Number(req.params.learner_id),
//   };
//   for (const key in req.body) {
//     switch (key) {
//       case "add":
//         await collection.updateOne(query, {
//           $push: { scores: req.body[key] },
//         });
//         break;
//       // case "remove":
//       //   await collection.updateOne(query, {
//       //     $pull: { scores: {score: req.body[key]} },
//       //   });
//       default:
//         break;
//     }
//   }
// });

export default router;
