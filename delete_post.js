import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    const params = {
        TableName: "posts_reddit",
        // 'Key' defines the partition key and sort key of the item to be removed
        // - 'userId': Identity Pool identity id of the authenticated user
        // - 'noteId': path parameter
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            postId: event.pathParameters.id
        }
    };

    try {
        const result = await dynamoDbLib.call("delete", params);
        console.log(result)
        callback(null, success(result));
    } catch (e) {
        callback(null, failure({ status: false }));
    }
}
