import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    const params = {
        TableName: "posts_reddit",
        // 'Key' defines the partition key and sort key of the item to be retrieved
        // - 'userId': Identity Pool identity id of the authenticated user
        // - 'noteId': path parameter
        KeyConditionExpression: "postId = :postId",

        ExpressionAttributeValues: {
            ":postId":event.pathParameters.id
        }
    };

    try {
        // const result = await dynamoDbLib.call("scan", params);

        const result = await dynamoDbLib.call("query", params);
        // console.log("RRRESSSSULLTTTTT")
        // console.log(result)
        if (result.Items) {
            // Return the retrieved item

            callback(null, success(result.Items));
        } else {
            callback(null, failure({ status: false, error: "Item not found." }));
        }
    } catch (e) {
        console.log("FAil result,",e)

        callback(null, failure({ status: false }));

    }
}
