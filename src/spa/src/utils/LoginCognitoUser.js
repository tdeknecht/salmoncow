// https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js#setup
export default function LoginCognitoUser(loginDetails) {
  const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

  const cognitoUserPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
  });
  
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: loginDetails.Username,
    Pool: cognitoUserPool,
  });
  
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(loginDetails);
  
  return new Promise((resolve, reject) =>
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve(result);
      },
      onFailure: (err) => {
        reject(err);
      }
    })
  );
}
