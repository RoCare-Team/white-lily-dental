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

/**
 * The unique-slot index, created so it can be redefined later.
 *
 * Mongo rejects createIndex when an index of the same name exists with
 * different options, so an options change is applied by dropping first. That
 * only happens once, on the deploy that changes them.
 */
async function createSlotIndex(leads) {
  const { SLOT_HOLDING_STATUSES } = await import("@/lib/leads");

  const spec = { clinicId: 1, slotDate: 1, slotTime: 1 };
  const options = {
    unique: true,
    name: "unique_slot",
    partialFilterExpression: {
      slotDate: { $exists: true },
      status: { $in: SLOT_HOLDING_STATUSES },
    },
  };

  try {
    await leads.createIndex(spec, options);
  } catch (error) {
    // 85 = IndexOptionsConflict, 86 = IndexKeySpecsConflict
    if (error?.code !== 85 && error?.code !== 86) throw error;
    await leads.dropIndex("unique_slot");
    await leads.createIndex(spec, options);
  }
}

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
      // patients clicking at the same moment cannot both get it. Cancelled and
      // spam bookings fall outside the index, which is what frees their slot.
      createSlotIndex(leads),
    ]).catch((error) => {
      // Never let index creation break a request — log and carry on.
      indexesReady = undefined;
      console.error("Failed to create leads indexes:", error);
    });
  }
  await indexesReady;

  return leads;
}

let clinicalReady;

/**
 * The clinical file: visits, the records on them and the bills raised against
 * them. Three collections rather than one document per patient, because a
 * record is edited on its own and a patient's file grows for years.
 */
async function getClinical() {
  const db = await getDb();
  const visits = db.collection("visits");
  const records = db.collection("records");
  const invoices = db.collection("invoices");

  if (!clinicalReady) {
    clinicalReady = Promise.all([
      // A patient's whole file, newest visit first.
      visits.createIndex({ phoneDigits: 1, date: -1, time: -1 }),
      // One visit per appointment: the upsert that starts a chart from a
      // booking relies on this, so two clicks cannot make two visits.
      visits.createIndex(
        { leadId: 1 },
        { unique: true, partialFilterExpression: { leadId: { $type: "objectId" } } }
      ),
      records.createIndex({ visitId: 1, createdAt: 1 }),
      records.createIndex({ phoneDigits: 1, createdAt: -1 }),
      invoices.createIndex({ visitId: 1, createdAt: 1 }),
      invoices.createIndex({ phoneDigits: 1, createdAt: -1 }),
    ]).catch((error) => {
      clinicalReady = undefined;
      console.error("Failed to create clinical indexes:", error);
    });
  }
  await clinicalReady;

  return { visits, records, invoices };
}

export async function getVisits() {
  return (await getClinical()).visits;
}

export async function getRecords() {
  return (await getClinical()).records;
}

export async function getInvoices() {
  return (await getClinical()).invoices;
}
