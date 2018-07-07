import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    let updateValue = ""
    let isUpdateBody = false
    console.log("type of vote: ", data.option)
    switch(data.option) {
        case "upVote":
            updateValue = "SET voteScore = voteScore + :inc"
            break
        case "downVote":
            updateValue = "SET voteScore = voteScore - :inc"
            break
        case "updateBody":
            isUpdateBody = true
            updateValue = "SET body = :body, time_stamp=:time_stamp"
            const params = {
                TableName: "comments_reddit",
                Key: {
                    postId: data.postId,
                    commentId: event.pathParameters.id
                },
                UpdateExpression: updateValue,
                ExpressionAttributeValues: {
                    ":body": data.body ? data.body : null ,
                    ":time_stamp": Date.now()

                },
                ReturnValues: "ALL_NEW"
            };
            try {
                const result = await dynamoDbLib.call("update", params);
                callback(null, success(result.Attributes ));
            } catch (e) {
                callback(null, failure({ status: false }));
            }
            break
        default:
            console.log(`comments.vote received incorrect parameter: ${data}`)
    }
    if (isUpdateBody === false){
        const params = {
            TableName: "comments_reddit",
            Key: {
                postId: data.postId,
                commentId: event.pathParameters.id
            },
            UpdateExpression: updateValue,
            ExpressionAttributeValues: {
                ":inc": 1,
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

}
