import { DATABASE, DB_ID } from './config/config.js'

const VERSION = 'CRUD 2';
const metaData = {
  VERSION
};

const COLLECTION_GROUP_ID = 'group';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

const createResponse = (statusCode, body, additionalHeaders = {}) => ({
  statusCode,
  headers: { ...defaultHeaders, ...additionalHeaders },
  body: JSON.stringify(body),
});

const STATUS_OK                 = 200;
const STATUS_ERROR              = 500;
const STATUS_NO_CONTENT         = 204;
const STATUS_METHOD_NOT_ALLOWED = 405;

const getResponseOK         = (body, additionalHeaders = {}) => createResponse(STATUS_OK,                 body, additionalHeaders);
const getResponseError      = (description, errorObj={}, additionalHeaders = {}) => createResponse(STATUS_ERROR,  {description, errorObj:JSON.stringify(errorObj, null, 2)}, additionalHeaders);
const getResponseNotContent = (body='', additionalHeaders = {}) => createResponse(STATUS_NO_CONTENT,         body, additionalHeaders);
const getResponseNotAllowed = (body, additionalHeaders = {}) => createResponse(STATUS_METHOD_NOT_ALLOWED, body, additionalHeaders);

const getAllGroups = async (log) => {
  try {
    log('try')
    const { documents } = await DATABASE.listDocuments(DB_ID, COLLECTION_GROUP_ID);
    const data = documents;
    return getResponseOK({ metaData, data });
  } catch (errorData) {
    log('error' + JSON.stringify(errorData, null, 2));
    return getResponseError('getAllGroups',errorData);
  }
};

export default async ({ req, res, log, error }) => {
  log('PROJECT_ID: '+ PROJECT_ID);
  log('API_KEY: '+ ETERNAL_API_KEY);
  log('DB_ID: ' + DB_ID);
  log('COLLECTION_GROUP_ID: ' + COLLECTION_GROUP_ID);
  log('CLIENT: ' + JSON.stringify(CLIENT, null, 2));
  log('DATABASE:' + JSON.stringify(DATABASE, null, 2));

  if (req.method === 'OPTIONS') {
    log('OPTIONS: ' + VERSION)
    return getResponseNotContent();
  }

  if (req.method === 'GET') {
    log('GET: ' + VERSION)
    return await getAllGroups(log);
  }

  return getResponseNotAllowed({ error: 'Method not allowed' });
};