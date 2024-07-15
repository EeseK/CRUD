import { DATABASE, DB_ID } from '../config/database.js'
import { ID } from 'node-appwrite';

const metaData = {
    VERSION: 'readAll 1'
}

import { getResponseOK, getResponseError } from '../responses/responses.js'

const create = async (payload, collectionId) => {
    const documentId = ID.unique();

    try {
        const appwriteResult = await DATABASE.createDocument(DB_ID, collectionId, documentId, payload);
        const data = {
        appwriteResult,
        documentId
        };
        return getResponseOK({ metaData, data });
    } catch (errorData) {
        return getResponseError('createDocument', errorData);
    }
};

const readAll = async (collectionId, log, error) => {
  log('readAll')
  log('DB_ID' + DB_ID);
  log('DATABASE' + JSON.stringify(DATABASE, null, 2));
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
        log('readAll Error'+JSON.stringify(errorData));
        error(JSON.stringify(errorData))
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
            create,
            readAll, 
            readById,
            update,
            deleteDocument
        }