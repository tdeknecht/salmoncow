import React from 'react';

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
