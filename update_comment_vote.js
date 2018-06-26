import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    const typeVote = JSON.parse(event.body);
    let voteValue = ""
    console.log("type of vote: ", typeVote.option)
    switch(typeVote.option) {
        case "upVote":
            voteValue = "SET voteScore = voteScore + :inc"
            break
        case "downVote":
            voteValue = "SET voteScore = voteScore - :inc"
            break
        default:
            console.log(`comments.vote received incorrect parameter: ${typeVote}`)
    }
    const params = {
        TableName: "comments_reddit",
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
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
        callback(null, success({ status: true }));
    } catch (e) {
        callback(null, failure({ status: false }));
    }
}
