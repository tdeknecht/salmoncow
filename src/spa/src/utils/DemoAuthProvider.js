import React from 'react';
// import { useNavigate } from 'react-router-dom';

import { fakeAuthProvider } from './fakeAuthProvider';

export const DemoAuthContext = React.createContext(null);

export function DemoAuthProvider({ children }) {
  // const navigate = useNavigate();

  const [token, setToken] = React.useState(null);

  const onLogin = (p, callback) => { // `async(p, callback)` approach requires await on call. Redundant to Promise below.
    // log in user and get token
    // const token = fakeAuthToken(); // `await fakeAuthToken()` bound to async() above

    loginCognitoUser(p.loginDetails)
      .then(tokenSet => {
        localStorage.setItem(process.env.REACT_APP_COGNITO_REFRESH_TOKEN, tokenSet.getIdToken().getJwtToken());
        setToken(tokenSet.getIdToken().getJwtToken())
        console.log("Login successful")

        // Send them back to the page they tried to visit when they were
        // redirected to the login page. Use { replace: true } so we don't create
        // another entry in the history stack for the login page.  This means that
        // when they get to the protected page and click the back button, they
        // won't end up back on the login page, which is also really nice for the
        // user experience.

        // navigate(p.from, { replace: true });
        callback();
      })
      .catch(err => {
        console.log(err)
        // setAlertContent(err.message || JSON.stringify(err));
        // setAlert(true);

        // setButtonLoading(false);
        // setDisableButton(false);
        callback(err)
      });
  };

  // const handleLogout = () => {
  const onLogout = () => {
    // remove refresh token here and set token to null
    // add new LogoutCognitoUser logic to truly log them out of Cognito

    localStorage.removeItem(process.env.REACT_APP_COGNITO_REFRESH_TOKEN)
    localStorage.removeItem(process.env.REACT_APP_COGNITO_ID_TOKEN)
    
    setToken(null);
  };

  const signin = (loginDetails, callback) => {
    console.log(loginDetails)
    return fakeAuthProvider.signin(() => {
      setToken("abc123");
      callback();
    });
  };


  const value = {
    token,
    onLogin,
    onLogout,

    signin, // a very simple version to test with

    // onLogin: handleLogin,
    // onLogout: handleLogout,
  };

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
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

