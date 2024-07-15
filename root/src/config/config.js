import { Client, Databases, ID } from 'node-appwrite';

const PROJECT_ID = process.env.PROJECT_ID;
const CLIENT = new Client();

CLIENT
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);

const DB_ID = 'groups';
const DATABASE = new Databases(CLIENT);

export {DATABASE, DB_ID}