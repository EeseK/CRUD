import { ID } from 'node-appwrite';
import { DATABASE, DB_ID } from '../config/config.js';

const metaData = {
    VERSION: 'delete'
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
  log('getErrorResponseById ' + JSON.stringify(errorData, null, 2));
  const isNotFound = 404 == errorData.code;
  if(isNotFound){
    log('isNotFound');
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
/group/6695902b2a7bdc08a5d6
*/
const update = async (id, payload, collectionId) => {
  try {
    const data = await DATABASE.updateDocument(DB_ID, collectionId, id, payload);
    data.requestedId = id;
    return getResponseOK({ metaData, data:{id:data.$id, name:data.name} });
  } catch (errorData) {
    const response = getErrorResponseById(errorData, id, collectionId);
    return response
  }
};
  
  const deleteDocument = async (id, collectionId) => {
    log('crud delete id: ' + id);
    log('crud delete collectionId: ' + collectionId);
    try {
      log('crud delete try');
      const data = await DATABASE.deleteDocument(DB_ID, collectionId, id);
      log('crud delete data ' + JSON.stringify(data, null, 2));
      const response = getResponseOK({ metaData, data: {id} });
      log('crud delete response ' + JSON.stringify(response, null, 2));
      return response
    } catch (errorData) {
      log('crud delete catch errorData: ' + JSON.stringify(errorData, null, 2));
      const response = getResponseError('deleteDocument', errorData);
      log('crud delete catch response: ' + JSON.stringify(response, null, 2));
      return response
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