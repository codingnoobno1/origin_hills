import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Invalid/Missing environment variable: 'MONGODB_URI'");
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

// Lazily connect to MongoDB on demand, preventing connection execution during static build analysis
export async function getMongoClient(): Promise<MongoClient> {
  if (clientPromise) {
    return clientPromise;
  }

  if (process.env.NODE_ENV === "development") {
    // Preserve connection across module reloads caused by HMR
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  return clientPromise;
}
