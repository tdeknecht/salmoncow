import React from 'react';
import { Redirect, Route } from "react-router-dom";

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}

      render = {({ location }) =>
        localStorage.getItem(process.env.REACT_APP_COGNITO_ID_TOKEN) ? (
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
