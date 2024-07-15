import { DATABASE, DB_ID } from './config/config.js'
import { getResponseNotContent, getResponseNotAllowed } from './responses/responses.js'
import { create, readAll, setLogAndError } from './services/crud.js'

const VERSION = 'CRUD 12 - Create: id';
const metaData = {
  VERSION
};

const COLLECTION_GROUP_ID = 'group';

export default async ({ req, res, log, error }) => {
  setLogAndError(log, error);
  log('VERSION: ' + VERSION)
  if (req.method === 'OPTIONS') {
    log('OPTIONS: ' + VERSION)
    return getResponseNotContent();
  }

  if (req.method === 'POST') {
    const { payload, action } = JSON.parse(req.body);
    if (!action) {
      return await create(payload, COLLECTION_GROUP_ID);
    }
  }

  if (req.method === 'GET') {
    
    return await readAll( COLLECTION_GROUP_ID );
  }

  return getResponseNotAllowed({ error: 'Method not allowed' });
};