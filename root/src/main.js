import { CLIENT } from './config/config.js'
import { getResponseNotContent, getResponseNotAllowed } from './responses/responses.js'

import { crud as groupCRUD } from './entities/groupCRUD.js'
import { crud as subgroupCRUD } from './entities/subgroupCRUD.js'
import { crud as storeCRUD } from './entities/groupCRUD.js'

const VERSION = 'CRUD TEMPLATES 5';

export default async ({ req, log, error }) => {
  if (req.method === 'OPTIONS') {
    return getResponseNotContent();
  }
  
  const parameters = req.path.split('/');
  const [ none, collectionId1, paramId1, collectionId2, paramId2 ] = parameters;

  if(groupCRUD.id === collectionId1){
    return await groupCRUD.handler(req, paramId1,log,error);
  }

  if(subgroupCRUD.id === collectionId1){
    return await subgroupCRUD.handler(req, paramId1,log,error);
  }

  if(storeCRUD.id === collectionId1){
    return await storeCRUD.handler(req, paramId1,log,error);
  }
  
  return getResponseNotAllowed({ error: 'Method not allowed' });
};