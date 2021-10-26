import React,{ useEffect } from 'react';
import { withRouter } from 'react-router-dom';

function Home(props) {
	useEffect(() => {
    // https://github.com/auth0/jwt-decode

    // TODO: Check token expiration. If expirted, redirectToLogin()... or pass refreshToken?

    // Example:
      // axios.get(API_BASE_URL+'/user/me', { headers: { 'token': localStorage.getItem(ACCESS_TOKEN_NAME) }})
      // .then(function (response) {
      // 	if(response.status !== 200){
      // 		redirectToLogin()
      // 	}
      // })
      // .catch(function (error) {
      // 	redirectToLogin()
      // });
	})

	// function redirectToLogin() {
	// 	props.history.push('/login');
	// }

	return(
		<div className="mt-2">
			You smell like poop.
		</div>
	)
}

export default withRouter(Home);
