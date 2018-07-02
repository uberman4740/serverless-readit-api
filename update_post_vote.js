import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    let voteValue = ""
    switch(data.option) {
        case "upVote":
            voteValue = "SET voteScore = voteScore + :inc"
            break
        case "downVote":
            voteValue = "SET voteScore = voteScore - :inc"
            break
        default:
            console.log(`comments.vote received incorrect parameter: ${data.option}`)
    }
    const params = {
        TableName: "posts_reddit",
        Key: {
            postId: event.pathParameters.id,
            userId: data.userId
        },
        UpdateExpression: voteValue,
        ExpressionAttributeValues: {
            ":inc": 1
        },
        ReturnValues: "ALL_NEW"
    };
    try {
        const result = await dynamoDbLib.call("update", params);
        callback(null, success(result.Attributes ));
    } catch (e) {
        callback(null, failure({ status: false }));
    }
}
