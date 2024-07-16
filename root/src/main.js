import { DATABASE, DB_ID } from './config/config.js'
import { getResponseNotContent, getResponseNotAllowed } from './responses/responses.js'
import { create, readAll, readById, update, deleteDocument, setLogAndError } from './services/crud.js'

const VERSION = 'CRUD 30 - delete NOT found';
const metaData = {
  VERSION
};

const COLLECTION_GROUP_ID = 'group';
const COLLECTION_SUBGROUP_ID = 'subgroup';

export default async ({ req, res, log, error }) => {
  setLogAndError(log, error);
  if (req.method === 'OPTIONS') {
    return getResponseNotContent();
  }

  const parameters = req.path.split('/');
  const [ none, paramCollection, paramId,  ] = parameters;
  log('paramCollection: ' + paramCollection);
  log('paramId: ' + paramId);

  if (req.method === 'POST') {
    const { payload, action } = JSON.parse(req.body);
    if (!action) {
      return await create(payload, COLLECTION_GROUP_ID);
    }
  }
  
  if (req.method === 'GET') {
    if(null == paramId){
      return await readAll( COLLECTION_GROUP_ID );
    }else{
      return await readById(paramId, COLLECTION_GROUP_ID);
    }
  }

  /*
  /group/66958f8c1de5ca1dd3e1
  {
    "payload":{
      "name": "HALLOWED BE THE NAME"
    }
  }
  */
  if (req.method === 'PATCH' && null != paramId) {
    const { payload } = JSON.parse(req.body);
    return await update(paramId, payload, COLLECTION_GROUP_ID);
  }

  if (req.method === 'DELETE' && null != paramId) {
    log('main DELETE paramId:' + paramId);
    return await deleteDocument(paramId, COLLECTION_GROUP_ID);
  }

  return getResponseNotAllowed({ error: 'Method not allowed' });
};