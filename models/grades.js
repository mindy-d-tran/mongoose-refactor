import mongoose from "mongoose";

const gradesSchema = new mongoose.Schema({
    scores: [{type: String, score: Number}]
    ,
    class_id: {
        type: Number,
        required: true
    },
    learner_id: {
        type: Number,
        required: true
    }
}, {collection: 'grades'})

export default mongoose.model('Grade', gradesSchema)