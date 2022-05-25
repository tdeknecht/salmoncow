import React from 'react';

import { AuthContext } from '../../utils/AuthProvider';

const Dashboard = () => {
  const { token } = React.useContext(AuthContext);

  return (
    <>
      <h2>Dashboard (Protected)</h2>

      <div>Authenticated as {token}</div>
    </>
  );
};

export { Dashboard };
