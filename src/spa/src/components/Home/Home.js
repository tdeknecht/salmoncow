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

			<SessionStatus />
		</Grid>
	)
}
  
function SessionStatus() {
  const { getSession } = React.useContext(AuthContext);

  const [session, setSession] = React.useState(false);

  getSession(session => {
    if(session) {
      console.log(session)
      setSession(true)
    } else {
      setSession(false)
    }
  });

  if (!session) {
    return(
      <p>You are not logged in. <Link to="/login">Login here.</Link></p>
    )
  }

  // getSession()
  //   .then(session => {
  //     console.log('Session: ', session.isValid());
  //     setSession(true)
  //   })
  //   .catch(err => {
  //     console.log('Session err: ', err);
  //   });

  //   if (!session) {
  //     return(
  //       <p>You are not logged in. <Link to="/login">Login here.</Link></p>
  //     )
  //   }
}
