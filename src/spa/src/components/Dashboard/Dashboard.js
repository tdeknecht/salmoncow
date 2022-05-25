import React from 'react';

import { DemoAuthContext } from '../../utils/DemoAuthProvider';

const Dashboard = () => {
  const { token } = React.useContext(DemoAuthContext);

  return (
    <>
      <h2>Dashboard (Protected)</h2>

      <div>Authenticated as {token}</div>
    </>
  );
};

export { Dashboard };
