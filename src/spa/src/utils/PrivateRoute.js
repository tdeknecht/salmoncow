import React from 'react';
import { Redirect, Route } from "react-router-dom";
import {
  COGNITO_ID_TOKEN,
  // COGNITO_ACCESS_TOKEN,
} from '../constants/cognito';

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        localStorage.getItem(COGNITO_ID_TOKEN) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
