

import { getResponseNotContent, getResponseNotAllowed } from './responses/responses.js'
import { readAll } from './services/crud.js'


const VERSION = 'CRUD 3';
const COLLECTION_GROUP_ID = 'group';

export default async ({ req, res, log, error }) => {
  log('VERSION: ' + VERSION);

  if (req.method === 'OPTIONS') {
    log('OPTIONS: ' + VERSION);
    return getResponseNotContent();
  }

  if (req.method === 'GET') {
    log('GET');
    const response = await readAll(COLLECTION_GROUP_ID, log, error);
    return res.send('UP the IRONS!');
  }
  /*
  if (req.method === 'POST') {
    const { payload, action } = JSON.parse(req.body);
    if (!action) {
      return await createDocument(payload);
    }
  }

  if (req.method === 'PUT') {
    const { id, payload, action } = JSON.parse(req.body);
    if (action === 'docById') {
      return await getDocumentById(id);
    }
    if (action === 'update') {
      return await updateDocument(id, payload);
    }
  }

  if (req.method === 'DELETE') {
    const { id } = JSON.parse(req.body);
    return await deleteDocument(id);
  }
  */

  return getResponseNotAllowed();
};
