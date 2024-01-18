import {MongoClient} from 'mongodb';

const connectionString = process.env.ATLAS_URI || "";
console.log(process.env.ATLAS_URI);

const client = new MongoClient(connectionString);

let conn;

try {
    conn = await client.connect();
    console.log("connnected to mongodb");
} catch (e) {
    console.log(e);
}

const db = conn.db("sample_training");
export default db;