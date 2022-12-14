/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const aws = require("aws-sdk");
const dynamoDBClient = new aws.DynamoDB();

const tableName = process.env.USERTABLE;

exports.handler = async (event) => {
  // insert code to be executed by your lambda trigger

  // create new user to DynamoDB 
  if(!event?.request?.userAttributes?.sub){
    console.log("No sub provided")
    return;
  }

  const now = new Date()
  const timestamp = now.getTime();
  
  const userItem = {
    __typename: { S: 'User' },
    _lastChangedAt: { N: timestamp.toString() },
    _version: { N: "1" },
    createdAt: { S: now.toISOString() },
    updatedAt: { S: now.toISOString() },
    id: { S: event.request.userAttributes.sub },
    name: { S: event.request.userAttributes.email },
  }

  console.warn(userItem)

  
  const params = {
    Item: userItem,
    TableName: tableName
  };

  console.warn(params)
  
  // save a new user to DynamoDB
  try {
    await dynamoDBClient.putItem(params).promise();
    console.log("success");
  } catch (e) {
    console.log(e)
  }
};
