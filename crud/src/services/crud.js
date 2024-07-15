import { DATABASE, DB_ID } from '../../database/database.js'
import { ID } from 'node-appwrite';

const metaData = {
    VERSION: 'CRUD 1'
}

import { getResponseOK, getResponseError } from '../../responses/responses.js'

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

const readAll = async (collectionId) => {
    try {
        const { documents } = await DATABASE.listDocuments(DB_ID, collectionId);

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