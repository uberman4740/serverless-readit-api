
import * as dynamoDbLib from "./libs/dynamodb-lib";
import {success, failure} from "./libs/response-lib";

export async function main(event, context, callback) {
    const params = {
        TableName: "comments_reddit",
        FilterExpression: "postId = :postId",
        ExpressionAttributeValues: {
            ":postId": event.pathParameters.id
        }


    };

    try {
        const result = await dynamoDbLib.call("scan", params);

        // Return the matching list of items in response body
        callback(null, success(result.Items));
    } catch (e) {
        callback(null, failure({status: false}));
    }
}
