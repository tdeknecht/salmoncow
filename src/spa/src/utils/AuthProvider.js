import React from 'react';

export const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {

  const [idToken, setIdToken] = React.useState(localStorage.getItem(process.env.REACT_APP_COGNITO_ID_TOKEN));

  const onLogin = (loginDetails, callback) => {
    loginCognitoUser({
      'Username' : loginDetails.email,
      'Password' : loginDetails.password,
    })
      .then(tokenSet => {
        // accessToken, idToken, refreshToken
        localStorage.setItem(process.env.REACT_APP_COGNITO_ID_TOKEN, tokenSet.getIdToken().getJwtToken());
        setIdToken(tokenSet.getIdToken().getJwtToken())

        callback();
      })
      .catch(err => {
        callback(err)
      });
  };

  const onLogout = (callback) => {
    // add new LogoutCognitoUser logic to truly log them out of Cognito

    localStorage.removeItem(process.env.REACT_APP_COGNITO_REFRESH_TOKEN)
    localStorage.removeItem(process.env.REACT_APP_COGNITO_ID_TOKEN)
    
    setIdToken(null);

    callback();
  };

  const onSignup = (signupDetails, callback) => {
    signupCognitoUser(signupDetails)
      .then(() => {
        callback();
      })
      .catch(err => {
        callback(err)
      });
  };

  // const fakeSigninA = (loginDetails, callback) => {
  //   console.log(loginDetails)
  //   return fakeAuthProvider.signin(() => {
  //     setIdToken("abc123");
  //     callback();
  //   });
  // };

  // const fakeSigninB = async () => {
  //   const token = await fakeAuthToken();

  //   setIdToken(idToken);
  //   navigate('/dashboard');
  // };

  const value = {
    idToken,
    onLogin,
    onLogout,
    onSignup,

    // fakeSigninA, // a very simple version to test with
    // fakeSigninB,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// TODO: Move both loginCognitoUser and signupCognitoUser to above

// https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js#setup
function loginCognitoUser(loginDetails) {
  const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

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

// https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js#setup
function signupCognitoUser(signupDetails) {
  const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

  const cognitoUserPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
      ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
    });

  const attributes = [
      // { Name: 'name', Value: p.name }
  ]

  return new Promise((resolve, reject) => (
      cognitoUserPool.signUp(signupDetails.email, signupDetails.password, attributes, signupDetails.validationData, (err, result) => {
      if (err) {
          reject(err);
      }
      resolve(result);
      })
  ));
}


// This represents some generic auth provider API, like Firebase.
// const fakeAuthProvider = {
//   isAuthenticated: false,
//   signin(callback) {
//     fakeAuthProvider.isAuthenticated = true;
//     setTimeout(callback, 250); // fake async
//   },
//   signout(callback) {
//     fakeAuthProvider.isAuthenticated = false;
//     setTimeout(callback, 250);
//   },
// };

// const fakeAuthToken = () =>
//   new Promise((resolve) => {
//     setTimeout(() => resolve('abc123'), 250);
// });

