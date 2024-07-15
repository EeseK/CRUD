import { Client, Databases } from 'node-appwrite';
const DB_ID = 'groups';
const PROJECT_ID = '6694de2d0012a80a218a'

const CLIENT = new Client();

CLIENT
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);

const DATABASE = new Databases(CLIENT);

export { DATABASE, DB_ID }