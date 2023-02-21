import React from 'react';
import { Link } from 'react-router-dom';

import Grid from '@mui/material/Grid';

import { AuthContext } from '../../utils/AuthProvider';

export default function Home() {
	return(
		<Grid
			container
			spacing={0}
			direction='column'
			alignItems='center'
		>
      Welcome!

			<AuthStatus />
		</Grid>
	)
}

function useAuth() {
	return React.useContext(AuthContext);
}
  
function AuthStatus() {
	let auth = useAuth();
  
	if (!auth.idToken) {
	  return(
      <p>You are not logged in. <Link to="/login">Login here.</Link></p>
      )
    }
  }
