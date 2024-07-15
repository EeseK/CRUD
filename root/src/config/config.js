import { Client, Databases, ID } from 'node-appwrite';
const PROJECT_ID = process.env.PROJECT_ID;
const ETERNAL_API_KEY = process.env.ETERNAL_API_KEY;

const CLIENT = new Client();
CLIENT
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject(PROJECT_ID)
.setKey(ETERNAL_API_KEY);

const DATABASE = new Databases(CLIENT);
const DB_ID = process.env.DB_ID;

export { DATABASE, DB_ID }