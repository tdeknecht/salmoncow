import React from 'react';
// import { useNavigate } from 'react-router-dom';

import LoginCognitoUser from './LoginCognitoUser';

import { fakeAuthProvider } from './fakeAuthProvider';

export const DemoAuthContext = React.createContext(null);

export function DemoAuthProvider({ children }) {
  // const navigate = useNavigate();

  const [token, setToken] = React.useState(null);

  const handleLogin = (p, callback) => { // async() requires await on call
    // log in user and get token
    // const token = fakeAuthToken(); // `await fakeAuthToken()` bound to async() above

    // call LoginCognitoUser. Eventually put that logic here
    LoginCognitoUser(p.loginDetails)
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
      });
    // set tokens
    // setToken(token);
  };

  const handleLogout = () => {
    // remove refresh token here and set token to null
    // add new LogoutCognitoUser logic

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

  let signout = (callback) => {
    return fakeAuthProvider.signout(() => {
      setToken(null);
      callback();
    });
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,

    signin,
    signout,
  };

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
  );
}
