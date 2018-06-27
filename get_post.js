import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    const params = {
        TableName: "posts_reddit",
        // 'Key' defines the partition key and sort key of the item to be retrieved
        // - 'userId': Identity Pool identity id of the authenticated user
        // - 'noteId': path parameter
        Key: {
            userId: "sagoo.karan@gmail.com",
            postId: "e7e5cf10-7912-11e8-a35a-0fcdce1c8a06"
        }
    };

    try {
        // const result = await dynamoDbLib.call("scan", params);

        const result = await dynamoDbLib.call("get", params);
        console.log("RRRESSSSULLTTTTT")
        console.log(result)
        if (result.Item) {
            // Return the retrieved item

            callback(null, success(result.Item));
        } else {
            callback(null, failure({ status: false, error: "Item not found." }));
        }
    } catch (e) {
        console.log("FAil result,")

        callback(null, failure({ status: false }));

    }
}
