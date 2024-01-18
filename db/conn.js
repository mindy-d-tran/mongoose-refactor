// import {MongoClient} from 'mongodb';
import mongoose from "mongoose";

export async function conn(){
    try {
        await mongoose.connect(process.env.ATLAS_URI);
        console.log('connected to MongoDB');
    } catch (error) {
        console.log(error.message);
    }
}

// const connectionString = process.env.ATLAS_URI || "";
// console.log(process.env.ATLAS_URI);

// const client = new MongoClient(connectionString);

// let conn;

// try {
    //     conn = await client.connect();
    //     console.log("connnected to mongodb");
    // } catch (e) {
        //     console.log(e);
        // }
        
        // const db = conn.db("sample_training");
        // export default db;