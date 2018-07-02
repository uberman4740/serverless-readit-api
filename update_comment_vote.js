import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    let voteValue = ""
    console.log("type of vote: ", data.option)
    switch(data.option) {
        case "upVote":
            voteValue = "SET voteScore = voteScore + :inc"
            break
        case "downVote":
            voteValue = "SET voteScore = voteScore - :inc"
            break
        default:
            console.log(`comments.vote received incorrect parameter: ${data}`)
    }
    const params = {
        TableName: "comments_reddit",
        Key: {
            postId: data.postId,
            commentId: event.pathParameters.id
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
