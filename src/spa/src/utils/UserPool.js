import { CognitoUserPool } from 'amazon-cognito-identity-js';

const UserPool = new CognitoUserPool({
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
  ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
});

export { UserPool }
