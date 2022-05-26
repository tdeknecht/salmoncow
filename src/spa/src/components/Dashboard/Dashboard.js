import React from 'react';
import jwt_decode from 'jwt-decode';

import { AuthContext } from '../../utils/AuthProvider';

const Dashboard = () => {
  const { token } = React.useContext(AuthContext);

  // Using Cognito tokens: https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html
  // const decoded = jwt_decode(localStorage.getItem(process.env.REACT_APP_COGNITO_ID_TOKEN));
  const decodedToken = jwt_decode(token);
  const decodedTokenExp = new Date(decodedToken.exp * 1000).toString()

  console.log(decodedToken)

  return (
    <>
      <h2>Dashboard (Protected)</h2>

      <div>Authenticated as {decodedToken.email}</div>
      <div>Token type: {decodedToken.token_use}</div>
      <div>Your token expires {decodedTokenExp}</div>
    </>
  );
};

export { Dashboard };
