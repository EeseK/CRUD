import { Databases } from 'node-appwrite';
import { CLIENT } from "./client.js";

const DB_ID = 'groups';
const DATABASE = new Databases(CLIENT);

log('JOJOJO')

export { DATABASE, DB_ID }