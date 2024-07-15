import { Client, Databases, ID } from 'node-appwrite';

const VERSION = 'CRUD 2';
const metaData = {
  VERSION
};
// f710690d28da71ed0518de33c90c691dbdbfe93b94c4dd942ee7007caa5d57eff108708fb5dbd5c985b1320e3a2a0dd0ffb11a5d29f552bf5bc89d6720946466652928b7055cbafab8a94dc9b6f1a8ca3f40c7127d7a996758a703e08c6d2ce1685e2caca81e94aabe2fe29433f4dead0a3f7f279e27d1f0a6e0bba6485de6d4
const ETERNAL_API_KEY = process.env.ETERNAL_API_KEY;
const PROJECT_ID = process.env.PROJECT_ID;
const DB_ID = process.env.DB_ID;
const COLLECTION_GROUP_ID = 'group';

const CLIENT = new Client();
CLIENT
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID)
  .setKey(ETERNAL_API_KEY)

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