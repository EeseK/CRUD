import { Client, Databases, ID, Query, Account } from 'node-appwrite';

const PROJECT_ID = process.env.PROJECT_ID;
const ETERNAL_API_KEY = process.env.ETERNAL_API_KEY;

const CLIENT = new Client();
      CLIENT
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(PROJECT_ID)
        .setKey(ETERNAL_API_KEY);

const DATABASE = new Databases(CLIENT);
const ACCOUNT = new Account(CLIENT);
const DB_ID = process.env.DB_ID;

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

const STATUS_OK                 = 200;
const STATUS_ERROR              = 500;
const STATUS_NO_CONTENT         = 204;
const STATUS_METHOD_NOT_ALLOWED = 405;
const STATUS_NOT_FOUND          = 404;

const getResponseOK         = (body, additionalHeaders = {}) => createResponse(STATUS_OK,                 body, additionalHeaders);
const getResponseError      = (description, errorObj, additionalHeaders = {}) => createResponse(STATUS_ERROR,  {description, errorObj:JSON.stringify(errorObj, null, 2)}, additionalHeaders);
const getResponseNotFound   = (body, additionalHeaders = {}) => createResponse(STATUS_NOT_FOUND,          body, additionalHeaders);
const getResponseNotContent = (body, additionalHeaders = {}) => createResponse(STATUS_NO_CONTENT,         body, additionalHeaders);
const getResponseNotAllowed = (body, additionalHeaders = {}) => createResponse(STATUS_METHOD_NOT_ALLOWED, body, additionalHeaders);

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

    const result = await DATABASE.createDocument( DB_ID, 
                                                  collectionId,
                                                  documentId,
                                                  payload);

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
                                                     /* SOme code here*/
                                                    }));

    const data = filteredDocuments;
    metaData.success = true;
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

const readWhere = async (collectionId, rawQueryList) => {
  metaData.action       = "readWhere";
  metaData.collectionId = collectionId;

  const queryList = rawQueryList.map((query)=>{
    const { attribute, patternList} = query;
    return Query.equal(attribute, patternList)
  });

  try {
    const { documents } = await DATABASE.listDocuments(DB_ID, collectionId, queryList);

    const data = documents;
    return getResponseOK({ metaData, data });

  } catch (errorData) {
      error(toString(errorData));
      return getResponseError('readAll', errorData);
  }
}

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

// Create anonymous session
const createAnonymousSession = async () => {
  try {
    const response = await ACCOUNT.createAnonymousSession();
    return response;
  } catch (errorData) {
    error(toString(errorData));
    const responseError = getResponseError('Error creating anonymous session', errorData);
    return responseError;
  }
};

// Example response setting a secure, HTTP-only cookie
const setSecureCookie = (res, sessionId) => {
  const cookieOptions = [
    `sessionId=${sessionId}`,
    'HttpOnly',
    'Secure',
    'SameSite=Strict', // or 'SameSite=Lax' depending on your requirements
    'Path=/', // Specify the path for which the cookie is valid
    'Max-Age=3600' // Cookie expiration time in seconds
  ];
  res.setHeader('Set-Cookie', cookieOptions.join('; '));
};


export default async ({ req, log, error }) => {
  if (req.method === 'OPTIONS') {
    return getResponseNotContent();
  }
  
  if (req.method === 'POST') {
    const payload = JSON.parse(req.body);
    try {
      const session = await createAnonymousSession();
      if (session.$id) {
        setSecureCookie(res, session.$id);
        const conversation = await create(payload, 'conversation');
        return conversation;
      } else {
        return getResponseError('Failed to create anonymous session');
      }
    } catch (errorData) {
      return getResponseError('Server Error', errorData);
    }
  }
  
  return getResponseNotAllowed({ error: 'Method not allowed' });
};