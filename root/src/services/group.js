import { create, readAll, readById, update, deleteDocument } from './services/crud.js'

const groupCollectionId = 'groups';

async function createGroup(){
    const response = await create(groupCollectionId);
    return response
}

export { createGroup }