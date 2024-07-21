import { CLIENT } from './config/config.js'
import { getResponseNotContent, getResponseNotAllowed } from './responses/responses.js'

import { crud as groupCRUD } from './entities/groupCRUD.js'
import { crud as subgroupCRUD } from './entities/subgroupCRUD.js'
import { crud as storeCRUD } from './entities/groupCRUD.js'
import { crud as group__subgroup__storeCRUD } from './entities/group__subgroup__storeCRUD.js'

const VERSION = 'CRUD TEMPLATES 5';

export default async ({ req, log, error }) => {
  if (req.method === 'OPTIONS') {
    return getResponseNotContent();
  }
  log('1. main')
  const parameters = req.path.split('/');
  const [ none, paramCollection, paramId,  ] = parameters;

  log('paramCollection: ' + paramCollection);
  log('paramId: ' + paramId);

  if(groupCRUD.id === paramCollection){
    log('1. Is GROUP')
    return await groupCRUD.handler(req, paramId,log,error);
  }

  if(subgroupCRUD.id === paramCollection){
    return await subgroupCRUD.handler(req, paramId,log,error);
  }

  if(storeCRUD.id === paramCollection){
    return await storeCRUD.handler(req, paramId,log,error);
  }

  if(storeCRUD.id === paramCollection){
    return await storeCRUD.handler(req, paramId,log,error);
  }

  if(group__subgroup__storeCRUD.id === paramCollection){
    return await group__subgroup__storeCRUD.handler(req, paramId,log,error);
  }

  return getResponseNotAllowed({ error: 'Method not allowed' });
};