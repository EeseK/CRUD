import { DATABASE, DB_ID } from './config/config.js'
import { getResponseNotContent, getResponseNotAllowed } from './responses/responses.js'
import { readAll } from './services/crud.js'

const VERSION = 'CRUD 5';
const metaData = {
  VERSION
};

const COLLECTION_GROUP_ID = 'group';

export default async ({ req, res, log, error }) => {
  if (req.method === 'OPTIONS') {
    log('OPTIONS: ' + VERSION)
    return getResponseNotContent();
  }

  if (req.method === 'GET') {
    log('GET: ' + VERSION)
    return await readAll(COLLECTION_GROUP_ID, log, error);
  }

  return getResponseNotAllowed({ error: 'Method not allowed' });
};