import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import {success, failure} from "./libs/response-lib";



export async function main(event, context, callback) {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);

    const params = {
        TableName: "posts_reddit",
        // 'Item' contains the attributes of the item to be created
        // - 'userId': user identities are federated through the
        //             Cognito Identity Pool, we will use the identity id
        //             as the user id of the authenticated user
        // - 'noteId': a unique uuid
        // - 'content': parsed from request body
        // - 'attachment': parsed from request body
        // - 'createdAt': current Unix timestamp
        Item: {
            postId: uuid.v1(),
            userId: event.requestContext.identity.cognitoIdentityId,
            time_stamp: Date.now(),
            voteScore: 0,
            deleted: "false",
            author: data.author,
            body: data.content,
            category: data.category,
            title: data.title,
        }
    };
    try {
        await dynamoDbLib.call("put", params);
        callback(null, success(params.Item));
    } catch (e) {
        console.log("ERRRRRO!!!!!!!!!!!!!!!!!!!!!!___________",e)
        callback(null, failure({ status: false }));
    }

}
