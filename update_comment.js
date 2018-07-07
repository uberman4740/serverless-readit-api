import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    console.log(data)
    const params = {
        TableName: "comments_reddit",
        Key: {
            postId: data.postId,
            commentId: event.pathParameters.id
        },
        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        UpdateExpression: "SET bodd = :boddy, time_stamp=:time_stamp",
        ExpressionAttributeValues: {

            ":boddy": data.opt ? data.opt : null ,
            ":time_stamp": Date.now()
        },
        ReturnValues: "ALL_NEW"
    };

    try {
        const result = await dynamoDbLib.call("update", params);
        callback(null, success(result.Attributes ));
    } catch (e) {
        callback(null, failure({ status: e }));
    }
}
