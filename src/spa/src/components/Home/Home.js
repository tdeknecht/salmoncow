import React from 'react';
import { UserPool } from '../../utils/UserPool';
import { Link } from 'react-router-dom';

import Grid from '@mui/material/Grid';

export default function Home() {
	return(
		<Grid
			container
			spacing={0}
			direction='column'
			alignItems='center'
		>
      Welcome!

			<LoginStatus />
		</Grid>
	)
}
  
function LoginStatus() {
  const user = UserPool.getCurrentUser();

  if (!user) {
    return (
      <p>You are not logged in. <Link to="/login">Login here.</Link></p>
    )
  } else {
    return (
      <p>
        Go to <Link to='/dashboard'>Dashboard</Link>
      </p>
    )
  }
}
