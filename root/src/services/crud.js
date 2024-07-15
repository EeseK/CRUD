import { ID } from 'node-appwrite';
import { DATABASE, DB_ID } from '../config/config.js';

const metaData = {
    VERSION: 'readAll 1'
}

function toString(object){
  return JSON.stringify(object, null, 2);
}

let log = ()=>{};
let error = ()=>{};

function setLogAndError(logToSet, errorToSet){
  log   = logToSet;
  error = errorToSet;
}

import { getResponseOK, getResponseError } from '../responses/responses.js'

/*
{
  "payload": {
    "name": "TEST-1"
  }
}
*/
const create = async (payload, collectionId) => {
    const documentId = ID.unique();
    log('Create');
    log('DB_ID ' + DB_ID);
    log('collectionId ' + collectionId);
    log('documentId ' + toString(documentId));
    log('payload ' + toString(payload));
    try {
        const rawResult = await DATABASE.createDocument(DB_ID, collectionId, documentId, payload);
        log('rawResult: ' +toString(rawResult));
        log('documentId: ' + documentId);
        const data = {
          documentId,
          name: rawResult.name
        };
        log('data: ' + toString(data));
        return getResponseOK({ metaData, data });
    } catch (errorData) {
        error('Error: ' + toString(errorData));
        return getResponseError('createDocument', errorData);
    }
};

const readAll = async (collectionId) => {
    try {
        const { documents } = await DATABASE.listDocuments(DB_ID, collectionId);
        log('documents '+JSON.stringify(documents));

        const filteredDocuments = documents.map(doc => ({
        id: doc.$id,
        name: doc.name
        }));

        const data = filteredDocuments;
        log('documents '+JSON.stringify(data));

        return getResponseOK({ metaData, data });
    } catch (errorData) {
        error(JSON.stringify(errorData));
        return getResponseError('readAll', errorData);
    }
};

const readById = async (id, collectionId) => {
    try {
        const data = await DATABASE.getDocument(DB_ID, collectionId, id);
        data.requestedId = id;
        return getResponseOK({ metaData, data });
    } catch (errorData) {
        return getResponseError('getDocumentById', errorData);
    }
};
    
  const update = async (id, payload, collectionId) => {
    try {
      const data = await DATABASE.updateDocument(DB_ID, collectionId, id, payload);
      data.requestedId = id;
      return getResponseOK({ metaData, data });
    } catch (errorData) {
      return getResponseError('updateDocument', errorData);
    }
  };
  
  const deleteDocument = async (id, collectionId) => {
    try {
      const data = await DATABASE.deleteDocument(DB_ID, collectionId, id);
      data.requestedId = id;
      return getResponseOK({ metaData, data });
    } catch (errorData) {
      return getResponseError('deleteDocument', errorData);
    }
  };

  export { 
            setLogAndError,
            create,
            readAll, 
            readById,
            update,
            deleteDocument
        }