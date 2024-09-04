import { env } from "@/env";
// @ts-ignore
import { MongoClient } from "mongodb";

declare global {
  // Extend the global object with a custom property
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | undefined;

if (!uri) {
  console.group("⚠️ MONGODB_URI missing from .env");
  console.error(
    "It's not mandatory but a database is required for Magic Links."
  );
  console.error(
    "If you don't need it, remove the code from /libs/next-auth.js (see connectMongo())"
  );
  console.groupEnd();
} else if (env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise!;
