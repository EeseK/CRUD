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

const createResponse = (statusCode, body, additionalHeaders = {}) => ({
  statusCode,
  headers: { ...defaultHeaders, ...additionalHeaders },
  body: JSON.stringify(body),
});

const getResponseOK         = (body, additionalHeaders = {}) => createResponse(STATUS_OK,                 body, additionalHeaders);
const getResponseError      = (description, errorObj, additionalHeaders = {}) => createResponse(STATUS_ERROR,  {description, errorObj:JSON.stringify(errorObj, null, 2)}, additionalHeaders);
const getResponseNotFound   = (body, additionalHeaders = {}) => createResponse(STATUS_NOT_FOUND,          body, additionalHeaders);
const getResponseNotContent = (body, additionalHeaders = {}) => createResponse(STATUS_NO_CONTENT,         body, additionalHeaders);
const getResponseNotAllowed = (body, additionalHeaders = {}) => createResponse(STATUS_METHOD_NOT_ALLOWED, body, additionalHeaders);

export {
    getResponseOK,
    getResponseError,
    getResponseNotAllowed,
    getResponseNotContent,
    getResponseNotFound
}