import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: "comments_reddit",

        Key: {
            postId: data.postId,
            commentId: event.pathParameters.id
        }
    };

    try {
        const result = await dynamoDbLib.call("delete", params);
        callback(null, success(result));
    } catch (e) {
        callback(null, failure(e));
    }
}
