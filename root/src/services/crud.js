import { ID } from 'node-appwrite';
import { DATABASE, DB_ID } from '../config/config.js';
import { getResponseOK, getResponseError } from '../responses/responses.js'

const metaData = {
  VERSION: 'CRUD 1'
}

function toString(object){
return JSON.stringify(object, null, 2);
}

let log   = ()=>{};
let error = ()=>{};

function setLogAndError(logToSet, errorToSet){
  log   = logToSet;
  error = errorToSet;
}

function getErrorResponseById(errorData, id, collectionId, metaData){
  const isNotFound = 404 == errorData.code;
  if(isNotFound){
    const data = getResponseOK({
                                    error:404,
                                    description:`readById: the id ${id} was not found in collection: ${collectionId}.`
                                  });
    return {data, metaData}
  }else{
    error('errorData: ' + toString(errorData));
    return getResponseError(toString(errorData),
                            errorData)
  }
}

const create = async (payload, collectionId) => {
  metaData.action       = "create";
  metaData.collectionId = collectionId;

  
  const documentId      = ID.unique();
  
  try {
    if(null == payload){
      throw new Error('Function error');
    }
  
    if(null == payload.name || '' == payload.name){
      throw new Error('Function error');
    }
    const result = await DATABASE.createDocument( DB_ID, 
                                                  collectionId,
                                                  documentId,
                                                  payload);

    const data = {
      id:   result.$id,
      name: result.name
    };

    return getResponseOK({ metaData, data });

  } catch (errorData) {
      error(toString(errorData));
      const responseError = getResponseError('Server Error');
      return  responseError
  }
};

const readAll = async (collectionId) => {
  metaData.action       = "readAll";
  metaData.collectionId = collectionId;
  try {
    const { documents } = await DATABASE.listDocuments(DB_ID, collectionId);
    const filteredDocuments = documents.map(doc => ({
                                                      id:   doc.$id,
                                                      name: doc.name
                                                    }));

    const data = filteredDocuments;
    return getResponseOK({ metaData, data });

  } catch (errorData) {
      error(toString(errorData));
      return getResponseError('readAll', errorData);
  }
};

const readById = async (id, collectionId) => {
  metaData.action       = "readById";
  metaData.collectionId = collectionId;

  try {
    const result = await DATABASE.getDocument(DB_ID,
                                              collectionId,
                                              id);

    const data = {
      id: result.$id,
      name: result.name
    }
    
    return getResponseOK({ metaData, data });

  } catch (errorData) {
    return getErrorResponseById(errorData,
                                id,
                                collectionId,
                                metaData);
  }
};

const update = async (id, payload, collectionId) => {
  metaData.action       = "update";
  metaData.collectionId = collectionId;

  try {
    const result = await DATABASE.updateDocument( DB_ID,
                                                  collectionId,
                                                  id,
                                                  payload);

    const data = {
      id:  result.$id,
      name:result.name
    }

    return getResponseOK({ metaData, data });

  } catch (errorData) {
    return getErrorResponseById(errorData,
                                id,
                                collectionId,
                                metaData);
  }
};
  
const deleteDocument = async (id, collectionId) => {
  metaData.action       = "delete";
  metaData.collectionId = collectionId;

  try {
    const result = await DATABASE.deleteDocument(DB_ID, collectionId, id);
    const data = {
                  id
                }
    return getResponseOK({ metaData, data });

  } catch (errorData) {

    return getErrorResponseById(errorData,
                                id,
                                collectionId,
                                metaData);
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