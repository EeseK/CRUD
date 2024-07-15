import { CLIENT } from './config/client.js'

import { getResponseNotContent, getResponseNotAllowed } from './responses/responses.js'

const VERSION = 'CRUD 1';

export default async ({ req, res, log, error }) => {
  if (req.method === 'OPTIONS') {
    log('OPTIONS: ' + VERSION);
    return getResponseNotContent();
  }

  if (req.method === 'GET') {
    log('GET: ' + VERSION);
    log('PATH: ' + req.path);
    /*
    const response = await readAll(COLLECTION_GROUP_ID);
    log('response:'+JSON.stringify(response, null, 2));
    */
    const response = '1. GET: Up the Irons!'
    return response
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
