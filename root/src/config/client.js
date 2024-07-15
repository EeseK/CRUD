import { Client, Databases } from 'node-appwrite';
const PROJECT_ID = process.env.PROJECT_ID;
const CLIENT = new Client();

CLIENT
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);

export { CLIENT }