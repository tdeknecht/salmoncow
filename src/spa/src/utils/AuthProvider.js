import React from 'react';

export const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {

  const [token, setToken] = React.useState(null);

  const onLogin = (p, callback) => {
    loginCognitoUser(p.loginDetails)
      .then(tokenSet => {
        localStorage.setItem(process.env.REACT_APP_COGNITO_REFRESH_TOKEN, tokenSet.getIdToken().getJwtToken());
        setToken(tokenSet.getIdToken().getJwtToken())

        callback();
      })
      .catch(err => {
        callback(err)
      });
  };

  const onLogout = () => {
    // add new LogoutCognitoUser logic to truly log them out of Cognito

    localStorage.removeItem(process.env.REACT_APP_COGNITO_REFRESH_TOKEN)
    localStorage.removeItem(process.env.REACT_APP_COGNITO_ID_TOKEN)
    
    setToken(null);
  };

  // const fakeSigninA = (loginDetails, callback) => {
  //   console.log(loginDetails)
  //   return fakeAuthProvider.signin(() => {
  //     setToken("abc123");
  //     callback();
  //   });
  // };

  // const fakeSigninB = async () => {
  //   const token = await fakeAuthToken();

  //   setToken(token);
  //   navigate('/dashboard');
  // };

  const value = {
    token,
    onLogin,
    onLogout,
    // onRegister, // TODO

    // fakeSigninA, // a very simple version to test with
    // fakeSigninB,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

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

