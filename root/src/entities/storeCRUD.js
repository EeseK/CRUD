import { create, readAll, readById, update, deleteDocument, setLogAndError } from '../services/crud.js'
const COLLECTION_ID = 'store';

async function handler ( req, paramId, log, error ) {
    setLogAndError(log, error);

    if (req.method === 'POST') {
        const { payload } = JSON.parse(req.body);
        return await create(payload, COLLECTION_ID);
    }

    if (req.method === 'GET') {
        if(null == paramId){
            return await readAll( COLLECTION_ID );
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