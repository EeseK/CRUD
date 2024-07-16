import { CLIENT } from './config/config.js'
import { getResponseNotContent, getResponseNotAllowed } from './responses/responses.js'

import { crud as groupCRUD } from './entities/groupCRUD.js'
import { crud as subgroupCRUD } from './entities/subgroupCRUD.js'
import { crud as storeCRUD } from './entities/groupCRUD.js'
import { crud as group__subgroup__storeCRUD } from './entities/group__subgroup__storeCRUD.js'

const VERSION = 'CRUD TEMPLATES 1';
const metaData = {
  VERSION
};


const COLLECTION_STORE_ID = 'store';

export default async ({ req, log, error }) => {
  setLogAndError(log, error);

  if (req.method === 'OPTIONS') {
    return getResponseNotContent();
  }

  const parameters = req.path.split('/');
  const [ none, paramCollection, paramId,  ] = parameters;

  log('paramCollection: ' + paramCollection);
  log('paramId: ' + paramId);

  if(groupCRUD.id === paramCollection){
    groupCRUD.handler(req, paramId,log,error);
  }

  if(subgroupCRUD.id === paramCollection){
    subgroupCRUD.handler(req, paramId,log,error);
  }

  if(storeCRUD.id === paramCollection){
    storeCRUD.handler(req, paramId,log,error);
  }

  if(storeCRUD.id === paramCollection){
    storeCRUD.handler(req, paramId,log,error);
  }

  if(group__subgroup__storeCRUD.id === paramCollection){
    group__subgroup__storeCRUD.handler(req, paramId,log,error);
  }

  return getResponseNotAllowed({ error: 'Method not allowed' });
};