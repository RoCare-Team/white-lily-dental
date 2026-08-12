import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("MONGODB_URI is not set. Add it to .env.local.");
}

if (!dbName) {
  throw new Error("MONGODB_DB is not set. Add it to .env.local.");
}

const options = { maxPoolSize: 10, serverSelectionTimeoutMS: 10000 };

/**
 * In development Next.js clears the module cache on every hot reload, which
 * would open a new pool on each edit until Atlas refuses connections. Cache the
 * promise on globalThis so reloads reuse the same client.
 */
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri, options).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri, options).connect();
}

export default clientPromise;

export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}

let indexesReady;

/** Creates the indexes the admin panel queries on. Runs once per process. */
export async function getLeads() {
  const db = await getDb();
  const leads = db.collection("leads");

  if (!indexesReady) {
    indexesReady = Promise.all([
      leads.createIndex({ createdAt: -1 }),
      leads.createIndex({ status: 1, createdAt: -1 }),
      leads.createIndex({ phone: 1 }),
      // Looking up which times are already taken at a clinic on a date.
      leads.createIndex({ clinicId: 1, slotDate: 1 }),
      // The database itself refuses a second booking of the same slot, so two
      // patients clicking at the same moment cannot both get it.
      leads.createIndex(
        { clinicId: 1, slotDate: 1, slotTime: 1 },
        {
          unique: true,
          name: "unique_slot",
          partialFilterExpression: { slotDate: { $exists: true } },
        }
      ),
    ]).catch((error) => {
      // Never let index creation break a request — log and carry on.
      indexesReady = undefined;
      console.error("Failed to create leads indexes:", error);
    });
  }
  await indexesReady;

  return leads;
}
