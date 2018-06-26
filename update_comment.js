import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: "comments_reddit",
        // 'Key' defines the partition key and sort key of the item to be updated
        // - 'userId': Identity Pool identity id of the authenticated user
        // - 'noteId': path parameter
        // Key:{
        //     "year": year,
        //     "title": title
        // },
        // UpdateExpression: "set info.rating = :r, info.plot=:p, info.actors=:a",
        // ExpressionAttributeValues:{
        //     ":r":5.5,
        //     ":p":"Everything happens all at once.",
        //     ":a":["Larry", "Moe", "Curly"]
        // },
        // ReturnValues:"UPDATED_NEW"
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            commentId: event.pathParameters.id
        },
        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        UpdateExpression: "SET body = :body, time_stamp=:time_stamp",
        ExpressionAttributeValues: {

            ":body": data.body ? data.body : null ,
            ":time_stamp": Date.now()
        },
        ReturnValues: "ALL_NEW"
    };

    try {
        const result = await dynamoDbLib.call("update", params);
        callback(null, success({ status: true }));
    } catch (e) {
        callback(null, failure({ status: false }));
    }
}
