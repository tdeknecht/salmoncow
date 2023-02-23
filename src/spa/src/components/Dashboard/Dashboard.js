import React from 'react';

import { UserPool } from '../../utils/UserPool';

const Dashboard = () => {
  const [user, setUser] = React.useState(null);

  function Session() {
    const cognitoUser = UserPool.getCurrentUser();

    // Use case 5. Retrieve user attributes for an authenticated user.
    cognitoUser.getSession(() => {
      cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        for (var i = 0; i < result.length; i++) {
          if (result[i].getName() === 'email') {
            setUser(result[i].getValue())
          }
          // console.log(
          //   result[i].getName() + ' :: ' + result[i].getValue()
          // );
        }
      });
    });

    return (
      <p>Hello, {user}</p>
    )
  }

  return (
    <>
      <h2>Dashboard</h2>

      <Session />
    </>
  );
};

export { Dashboard };
