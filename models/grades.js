import mongoose from "mongoose";

const score = new mongoose.Schema({
    type: String,
    score: Number
}, {_id: false})

const gradesSchema = new mongoose.Schema({
    scores: [score]
    ,
    class_id: {
        type: Number,
        required: true
    },
    learner_id: {
        type: Number,
        required: true
    }
}, 
// linking pre-existing collection
{collection: 'grades'})

export default mongoose.model('Grade', gradesSchema)