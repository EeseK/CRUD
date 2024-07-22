import { create, readAll, readById, update, deleteDocument, setLogAndError } from '../services/crud.js'
const COLLECTION_ID = 'subgroup';

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

/*
Ensuring consistency in a database when performing multiple operations in a single request can be challenging, 
especially if one of the operations fails. In the context of Appwrite, 
you can handle this by implementing a form of transaction-like behavior manually, 
as Appwrite does not currently support multi-document transactions natively.

Here's a strategy you can use to ensure consistency:

Staging Area: Use a staging collection where you initially store the documents.
Once all operations are successful, you can move them to their respective final collections.

Rollback Mechanism: Implement a rollback mechanism where, 
if any operation fails, you remove or revert the changes made by the previous successful operations.

Atomic Operations: Ensure each operation is atomic and can be reversed if necessary.

Here is an example implementation in a function using Node.js and the Appwrite SDK:

const sdk = require("node-appwrite");

module.exports = async function (req, res) {
    const client = new sdk.Client();

    const database = new sdk.Databases(client);

    if (
        !req.variables["APPWRITE_FUNCTION_ENDPOINT"] ||
        !req.variables["APPWRITE_FUNCTION_API_KEY"]
    ) {
        res.status(500).send("Missing environment variables.");
        return;
    }

    client
        .setEndpoint(req.variables["APPWRITE_FUNCTION_ENDPOINT"])
        .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
        .setKey(req.variables["APPWRITE_FUNCTION_API_KEY"]);

    try {
        // Begin operations
        const document1 = await database.createDocument(
            "collectionId1",
            "unique()",
            { data  }
        );

        // Simulate a failure in the second operation
        const document2 = await database.createDocument(
            "collectionId2",
            "unique()",
            { data }
        );

        res.json({ success: true, document1, document2 });
    } catch (error) {
        // Handle the error and rollback
        console.error(error);

        // Rollback the first document if the second fails
        try {
            if (document1) {
                await database.deleteDocument("collectionId1", document1.$id);
            }
        } catch (rollbackError) {
            console.error("Rollback failed", rollbackError);
        }

        res.status(500).json({ success: false, error: error.message });
    }
};
Steps:
Perform the First Operation: Add the first document to the collection.
Perform the Second Operation: Try to add the second document.
Catch Any Errors: If the second operation fails, catch the error.
Rollback if Needed: If the second operation fails, delete the first document to ensure consistency.
Return the Result: Send a response indicating success or failure.
This method ensures that if any part of your multi-operation request fails, the changes made by previous operations are undone, maintaining consistency in your database.
*/