import React from 'react';
import jwt_decode from 'jwt-decode';

import { AuthContext } from '../../utils/AuthProvider';

const Dashboard = () => {
  const { cognitoUser } = React.useContext(AuthContext);
  const { idToken } = React.useContext(AuthContext);
  const { accessToken } = React.useContext(AuthContext);

  // Using Cognito tokens: https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html
  // const decodedIdToken = jwt_decode(localStorage.getItem(process.env.REACT_APP_COGNITO_ID_TOKEN));
  const decodedIdToken = jwt_decode(idToken);

  const decodedAccessToken = jwt_decode(accessToken);
  const decodedAccessTokenExp = new Date(decodedAccessToken.exp * 1000).toString()

  console.log(decodedIdToken)
  console.log(decodedAccessToken)

  // DEV: Example 5
  cognitoUser.getUserAttributes(function(err, result) {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }
    for (var i = 0; i < result.length; i++) {
      console.log(
        'attribute ' + result[i].getName() + ' has value ' + result[i].getValue()
      );
    }
  });

  return (
    <>
      <h2>Dashboard</h2>

      <div>Authenticated as {decodedIdToken.email}</div>

      <p></p>

      <div>Token type: {decodedAccessToken.token_use}</div>
      <div>Scope: {decodedAccessToken.scope}</div>
      <div>Your token expires {decodedAccessTokenExp}</div>
    </>
  );
};

export { Dashboard };
