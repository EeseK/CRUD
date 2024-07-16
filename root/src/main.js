import { DATABASE, DB_ID } from './config/config.js'
import { getResponseNotContent, getResponseNotAllowed } from './responses/responses.js'
import { create, readAll, readById, update, setLogAndError } from './services/crud.js'

const VERSION = 'CRUD 18 - upate id found';
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
    log('main PATH paramId:' + paramId);
    const { payload } = JSON.parse(req.body);
    log('main PATH payload:' + JSON.stringify(payload, null, 2));
    return await update(paramId, payload, COLLECTION_GROUP_ID);
  }

  return getResponseNotAllowed({ error: 'Method not allowed' });
};