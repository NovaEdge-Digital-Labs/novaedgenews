import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novaedge';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectDB(): Promise<Db> {
    if (cachedDb) {
        return cachedDb;
    }

    if (!cachedClient) {
        cachedClient = new MongoClient(MONGODB_URI);
        await cachedClient.connect();
    }

    const dbName = MONGODB_URI.substring(MONGODB_URI.lastIndexOf('/') + 1).split('?')[0] || 'novaedge';
    cachedDb = cachedClient.db(dbName);

    return cachedDb;
}
