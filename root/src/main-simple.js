import { Client, Databases, ID } from 'node-appwrite';

const VERSION = 'CRUD 1';
const metaData = {
  VERSION
};

const PROJECT_ID = process.env.PROJECT_ID;
const DB_ID = process.env.DB_ID;
const COLLECTION_GROUP_ID = 'group';

const CLIENT = new Client();
CLIENT
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID)

const DATABASE = new Databases(CLIENT);

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

const getAllReservationList = async (log) => {
  try {
    log('try')
    const { documents } = await DATABASE.listDocuments(DB_ID, COLLECTION_GROUP_ID);
    const data = documents;
    return getResponseOK({ metaData, data });
  } catch (errorData) {
    log('error' + JSON.stringify(errorData, null, 2));
    return getResponseError('getAllReservationList',errorData);
  }
};

export default async ({ req, res, log, error }) => {
  if (req.method === 'OPTIONS') {
    log('OPTIONS: ' + VERSION)
    return getResponseNotContent();
  }

  if (req.method === 'GET') {
    log('GET: ' + VERSION)
    return await getAllReservationList(log);
  }

  return getResponseNotAllowed({ error: 'Method not allowed' });
};
