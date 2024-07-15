import { getResponseNotContent, getResponseNotAllowed } from './responses/responses.js'
import { create, readAll, readById, update, deleteDocument } from './services/crud.js'

const COLLECTION_GROUP_ID = process.env.COLLECTION_GROUP_ID;

export default async ({ req, res, log, error }) => {
  if (req.method === 'OPTIONS') {
    log('OPTIONS: ' + VERSION);
    return getResponseNotContent();
  }

  /* CREATE */
  if (req.method === 'POST') {
    const { payload, action } = JSON.parse(req.body);
    if (!action) {
      return await create(payload, COLLECTION_GROUP_ID);
    }
    // Additional POST actions here...
  }

  /* READ */
  if (req.method === 'GET') {
    log('GET: ' + VERSION);
    const response = await readAll(COLLECTION_GROUP_ID);
    log('response:'+JSON.stringify(response, null, 2));
    log('path: ', req.path);
    return response
  }

  if (req.method === 'PUT') {
    const { id, payload, action } = JSON.parse(req.body);
    if (action === 'read') {
      return await readById(id, COLLECTION_GROUP_ID);
    }
    if (action === 'update') {
      return await update(id, payload, COLLECTION_GROUP_ID);
    }
  }

  if (req.method === 'DELETE') {
    const { id } = JSON.parse(req.body);
    return await deleteDocument(id, COLLECTION_GROUP_ID);
  }

  return getResponseNotAllowed();
};
