import { Client, Databases, ID, Account } from 'node-appwrite';
import cookie from 'cookie';

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
  'Access-Control-Allow-Origin': 'https://your-frontend-domain.com', // Only allow requests from your frontend domain
  'Access-Control-Allow-Methods': 'GET, PUT, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true', // Allow cookies to be sent with requests
};

const STATUS_OK = 200;
const STATUS_ERROR = 500;
const STATUS_NO_CONTENT = 204;
const STATUS_METHOD_NOT_ALLOWED = 405;
const STATUS_NOT_FOUND = 404;

const getResponseOK = (body, additionalHeaders = {}) => createResponse(STATUS_OK, body, additionalHeaders);
const getResponseError = (description, errorObj, additionalHeaders = {}) => createResponse(STATUS_ERROR, { description, errorObj: JSON.stringify(errorObj, null, 2) }, additionalHeaders);
const getResponseNotFound = (body, additionalHeaders = {}) => createResponse(STATUS_NOT_FOUND, body, additionalHeaders);
const getResponseNotContent = (body, additionalHeaders = {}) => createResponse(STATUS_NO_CONTENT, body, additionalHeaders);
const getResponseNotAllowed = (body, additionalHeaders = {}) => createResponse(STATUS_METHOD_NOT_ALLOWED, body, additionalHeaders);

const metaData = {
  VERSION: 'CRUD 1'
};

function toString(object) {
  return JSON.stringify(object, null, 2);
}

let log = () => {};
let error = () => {};

function setLogAndError(logToSet, errorToSet) {
  log = logToSet;
  error = errorToSet;
}

function getErrorResponseById(errorData, id, collectionId, metaData) {
  const isNotFound = 404 == errorData.code;
  if (isNotFound) {
    const data = getResponseOK({
      error: 404,
      description: `readById: the id ${id} was not found in collection: ${collectionId}.`
    });
    return { data, metaData };
  } else {
    error('errorData: ' + toString(errorData));
    return getResponseError(toString(errorData), errorData);
  }
}

const createSession = async () => {
  const sessionId = ID.unique();
  const expirationTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

  try {
    await DATABASE.createDocument(DB_ID, 'sessions', sessionId, {
      expirationTime: expirationTime.toISOString()
    });
    return { sessionId, expirationTime };
  } catch (errorData) {
    error(toString(errorData));
    throw new Error('Failed to create session');
  }
};

const validateSession = async (sessionId) => {
  try {
    const session = await DATABASE.getDocument(DB_ID, 'sessions', sessionId);
    const currentTime = new Date();
    const expirationTime = new Date(session.expirationTime);
    return currentTime < expirationTime;
  } catch (errorData) {
    error(toString(errorData));
    return false;
  }
};

// Read cookie from request headers
const getSessionIdFromCookie = (req) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  return cookies.sessionId;
};

// Set a new session ID cookie with longer expiration time
const setSessionIdCookie = (res, sessionId, maxAge = 604800) => { // 7 days in seconds
  const cookieOptions = [
    `sessionId=${sessionId}`,
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    'Path=/',
    `Max-Age=${maxAge}` // Cookie expiration time in seconds
  ];
  res.setHeader('Set-Cookie', cookieOptions.join('; '));
};

export default async ({ req, res, log, error }) => {
  if (req.method === 'OPTIONS') {
    return res.writeHead(204, defaultHeaders).end();
  }

  setLogAndError(log, error);

  let sessionId = getSessionIdFromCookie(req);
  let isValidSession = false;

  if (sessionId) {
    isValidSession = await validateSession(sessionId);
  }

  if (!sessionId || !isValidSession) {
    const session = await createSession();
    sessionId = session.sessionId;
    setSessionIdCookie(res, sessionId); // Set longer expiration
  }

  if (req.method === 'POST') {
    const payload = JSON.parse(req.body);
    try {
      payload.sessionId = sessionId;
      const conversation = await create(payload, 'conversation');
      return res.writeHead(200, defaultHeaders).end(JSON.stringify({ conversation, sessionId }));
    } catch (errorData) {
      return res.writeHead(500, defaultHeaders).end(JSON.stringify({ error: 'Server Error', details: errorData }));
    }
  }

  return res.writeHead(405, defaultHeaders).end(JSON.stringify({ error: 'Method not allowed' }));
};