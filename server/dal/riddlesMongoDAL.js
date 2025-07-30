import { connect } from '../db/mongoConnect.js';
import { ObjectId } from 'mongodb';

const COLLECTION = 'riddles';

export async function getAllRiddles() {
  const db = await connect();
  return db.collection(COLLECTION).find({}).toArray();
}

export async function addRiddle(riddle) {
  const db = await connect();
  const result = await db.collection(COLLECTION).insertOne(riddle);
  return { ...riddle, _id: result.insertedId };
}

export async function updateRiddle(id, updatedFields) {
  const db = await connect();
  const result = await db.collection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updatedFields },
    { returnDocument: 'after' }
  );
  return result.value;
}

export async function deleteRiddle(id) {
  const db = await connect();
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}