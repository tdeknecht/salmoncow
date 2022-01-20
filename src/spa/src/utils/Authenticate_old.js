import * as AWS from 'aws-sdk/global';
import { useCallback } from 'react';

function Authenticate(loginDetails) {
  // https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js#setup
  function loginCognitoUser() {
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
          console.log('Successfully authenticated', result);
          resolve(result);
        },
        onFailure: (err) => {
          console.log('Error authenticating', err);
          reject(err);
        }
     })
    );
  }

  return loginCognitoUser()
    // .then(tokenSet => loginCognitoUser())
    .then(tokenSet => {
      return tokenSet;
      // return true;
    })
    .catch(err => console.log(err));


  // cognitoUser.authenticateUser(authenticationDetails, {
  //   onSuccess: function(result) {
  //     // const refreshToken = result.getRefreshToken().getToken();
  //     // localStorage.setItem(process.env.REACT_APP_COGNITO_REFRESH_TOKEN, refreshToken);

  //     // const idToken = result.getIdToken().getJwtToken();
  //     // localStorage.setItem(process.env.REACT_APP_COGNITO_ID_TOKEN, idToken);

  //     const tokenSet = {
  //       refreshToken: result.getRefreshToken().getToken(),
  //       accessToken: result.getAccessToken().getJwtToken(),
  //       idToken: result.getIdToken().getJwtToken(),
  //     }

  //     AWS.config.region = process.env.REACT_APP_AWS_REGION;
  //     AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  //       IdentityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
  //       Logins: {
  //         ['cognito-idp.' + process.env.REACT_APP_AWS_REGION + '.amazonaws.com/' + process.env.REACT_APP_COGNITO_USER_POOL_ID] : result.getIdToken().getJwtToken(),
  //       },
  //     });
  
  //     // refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
  //     AWS.config.credentials.refresh(err => {
  //       if (err) {
  //         // props.showError(err.message || JSON.stringify(err))
  //         console.error(err);
  //       } else {


  //         // Instantiate aws sdk service objects here, now that the credentials have been updated.
  //         // example: var s3 = new AWS.S3();

  //         // setState(prevState => ({
  //         //   ...prevState,
  //         //   'successMessage' : 'Authentication successful.'
  //         // }))
  //         // redirectToHome();
  //         // props.showError(null)
  //         // console.log("here")
  //       }
  //     });
  //   },
  
  //   onFailure: function(err) {
  //     console.error(err);
  //     // return err;
  //   },
  // });
}

export default Authenticate;
