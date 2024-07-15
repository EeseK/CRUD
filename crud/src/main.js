import { Client, Databases, ID } from 'node-appwrite';

import { getResponseOK, getResponseError, getResponseNotContent, getResponseNotAllowed } from './responses/responses.js'

const VERSION = 'FETCH 18';
const PROJECT_ID = process.env.PROJECT_ID;
const DB_ID = process.env.DB_ID;
const COLLECTION_GROUP_ID = process.env.COLLECTION_GROUP_ID;

const CLIENT = new Client();
CLIENT
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

const DATABASE = new Databases(CLIENT);

const metaData = {
  VERSION
};

const readAll = async () => {
  try {
    const { documents } = await DATABASE.listDocuments(DB_ID, COLLECTION_GROUP_ID);

    const filteredDocuments = documents.map(doc => ({
      id: doc.$id,
      name: doc.name
    }));
    const data = filteredDocuments;
    return getResponseOK({ metaData, data });
  } catch (errorData) {
    return getResponseError('readAll', errorData);
  }
};

const createDocument = async (payload) => {
  const documentId = ID.unique();

  try {
    const appwriteResult = await DATABASE.createDocument(DB_ID, COLLECTION_GROUP_ID, documentId, payload);
    const data = {
      appwriteResult,
      documentId
    };
    return getResponseOK({ metaData, data });
  } catch (errorData) {
    return getResponseError('createDocument', errorData);
  }
};

const getDocumentById = async (id) => {
  try {
    const data = await DATABASE.getDocument(DB_ID, COLLECTION_GROUP_ID, id);
    data.requestedId = id;
    return getResponseOK({ metaData, data });
  } catch (errorData) {
    return getResponseError('getDocumentById', errorData);
  }
};

const updateDocument = async (id, payload) => {
  try {
    const data = await DATABASE.updateDocument(DB_ID, COLLECTION_GROUP_ID, id, payload);
    data.requestedId = id;
    return getResponseOK({ metaData, data });
  } catch (errorData) {
    return getResponseError('updateDocument', errorData);
  }
};

const deleteDocument = async (id) => {
  try {
    const data = await DATABASE.deleteDocument(DB_ID, COLLECTION_GROUP_ID, id);
    data.requestedId = id;
    return getResponseOK({ metaData, data });
  } catch (errorData) {
    return getResponseError('deleteDocument', errorData);
  }
};

export default async ({ req, res, log, error }) => {
  if (req.method === 'OPTIONS') {
    log('OPTIONS: ' + VERSION);
    return getResponseNotContent();
  }

  if (req.method === 'POST') {
    const { payload, action } = JSON.parse(req.body);
    log('1. POST!!!')
    if (!action) {
      log('CALL CREATE DOCUMENT')
      log(JSON.stringify(req.body, null, 2))
      log('Payload:' + JSON.stringify(payload, null, 2));
      log('COLLECTION_GROUP_ID: ' + COLLECTION_GROUP_ID);
      return await createDocument(payload);
    }
    log('NOTHING TO DO')
    // Additional POST actions here...
  }

  if (req.method === 'GET') {
    log('GET: ' + VERSION);
    const response = await readAll();
    log('response:'+JSON.stringify(response, null, 2));
    return response
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

  return getResponseNotAllowed();
};
