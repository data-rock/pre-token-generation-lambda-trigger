import AWS from 'aws-sdk';

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

export const getUser = async (username) => {
  const params = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: username,
  };

  return cognitoidentityserviceprovider.adminGetUser(params).promise();
};
