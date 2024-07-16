import { ID } from 'node-appwrite';
import { DATABASE, DB_ID } from '../config/config.js';

const metaData = {
    VERSION: 'update'
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

import { getResponseOK, getResponseError, getResponseNotFound } from '../responses/responses.js'

const create = async (payload, collectionId) => {
    const documentId = ID.unique();
    try {
        const rawResult = await DATABASE.createDocument(DB_ID, collectionId, documentId, payload);
        const data = {
          id: rawResult.$id,
          name: rawResult.name
        };
        return getResponseOK({ metaData, data });
    } catch (errorData) {
        error(toString(errorData));
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
        error(toString(errorData));
        return getResponseError('readAll', errorData);
    }
};

function getErrorResponseById(errorData, id, collectionId){
  const isNotFound = 404 == errorData.code;
  if(isNotFound){
    return getResponseOK({error:404, description:`readById: the id ${id} was not found in collection: ${collectionId}.`})
  }else{
    error('errorData: ' + toString(errorData));
    return getResponseError(toString(errorData), errorData)
  }
}

const readById = async (id, collectionId) => {
  try {
      const result = await DATABASE.getDocument(DB_ID, collectionId, id);
      const data = {
        id: result.$id,
        name: result.name
      }
      return getResponseOK({ metaData, data:{} });

  } catch (errorData) {
    return getErrorResponseById(errorData, id, collectionId);
  }
};

/*
/group/66958f8c1de5ca1dd3e1
*/
const update = async (id, payload, collectionId) => {
  log('crud update id: ' + id);
  log('crud update payload: ' + JSON.stringify(payload, null, 2));
  log('crud update collectionId: ' + collectionId);
  try {
    log('crud update try');
    const data = await DATABASE.updateDocument(DB_ID, collectionId, id, payload);
    log('crud update data '+JSON.stringify(data, null, 2));
    data.requestedId = id;
    return getResponseOK({ metaData, data:{id:data.$id, name:data.name} });
  } catch (errorData) {
    const response = getErrorResponseById(errorData, id, collectionId);
    log('Error response '+JSON.stringify(errorData, null, 2));
    return response
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