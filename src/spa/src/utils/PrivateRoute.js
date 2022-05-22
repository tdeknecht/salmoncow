import React from 'react';
import { Navigate, Route } from "react-router-dom";

export default function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}

      render = {({ location }) =>
        localStorage.getItem(process.env.REACT_APP_COGNITO_REFRESH_TOKEN) ? (
          children
        ) : (
          <Navigate
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
