import { create, readAll, readById, readWhere, update, deleteDocument, setLogAndError } from '../services/crud.js'
const COLLECTION_ID = 'group__subgroup__store';

async function handler (req, collectionId1, paramId1, collectionId2, paramId2, log,error) {
    setLogAndError(log, error);
    if (req.method === 'POST') {
        const { payload } = JSON.parse(req.body);
        return await create(payload, COLLECTION_ID);
    }

    if (req.method === 'GET') {
        if(null == paramId){
            return await readAll( COLLECTION_ID );
        }else if('group' == collectionId1 && 'subgroup' == collectionId2){
            const rawQuery = [
                {
                    attribute: paramId1,
                    patternList: [ collectionId1 ]
                },
                {
                    attribute: paramId2,
                    patternList: [ collectionId2 ]
                }
            ]
        }else{
            return await readById(paramId, COLLECTION_ID);
        }
    }

    if (req.method === 'PATCH' && null != paramId) {
        const { payload } = JSON.parse(req.body);
        return await update(paramId, payload, COLLECTION_ID);
    }

    if (req.method === 'DELETE' && null != paramId) {
        return await deleteDocument(paramId, COLLECTION_ID);
    }

    return getResponseNotAllowed({ error: 'Method not allowed' });
}

const crud = {
    handler,
    id: COLLECTION_ID
}

export { crud }