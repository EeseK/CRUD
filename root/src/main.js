import { DATABASE, DB_ID } from './config/config.js'
import { getResponseNotContent, getResponseNotAllowed } from './responses/responses.js'
import { create, readAll, setLogAndError } from './services/crud.js'

const VERSION = 'CRUD 6';
const metaData = {
  VERSION
};

const COLLECTION_GROUP_ID = 'group';

export default async ({ req, res, log, error }) => {
  setLogAndError(log, error);

  if (req.method === 'OPTIONS') {
    log('OPTIONS: ' + VERSION)
    return getResponseNotContent();
  }

  if (req.method === 'GET') {
    log('GET: ' + VERSION)
    return await readAll( COLLECTION_GROUP_ID );
  }

  return getResponseNotAllowed({ error: 'Method not allowed' });
};