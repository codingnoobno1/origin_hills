import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

export function isSandboxMode(): boolean {
  return (
    !process.env.MONGODB_URI ||
    process.env.MONGODB_URI.includes("YOUR_PASSWORD_HERE") ||
    process.env.MONGODB_URI.includes("abcde") ||
    process.env.MONGODB_URI === ""
  );
}

export async function getMongoClient(): Promise<MongoClient> {
  if (isSandboxMode()) {
    throw new Error("SANDBOX_MODE");
  }

  if (clientPromise) return clientPromise;

  if (process.env.NODE_ENV === "development") {
    const g = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };
    if (!g._mongoClientPromise) {
      client = new MongoClient(uri, options);
      g._mongoClientPromise = client.connect();
    }
    clientPromise = g._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  return clientPromise;
}

export async function getDb(dbName?: string) {
  const c = await getMongoClient();
  return c.db(dbName || process.env.MONGODB_DB || "origin_hills");
}
