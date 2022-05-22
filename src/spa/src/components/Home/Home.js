import React,{ useEffect } from 'react';
// import jwt_decode from 'jwt-decode';

function Home(props) {
	useEffect(() => {
    // https://github.com/auth0/jwt-decode or my personal javascript repo for snippets
    // Using Cognito tokens: https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html

    // const decoded = jwt_decode(localStorage.getItem(process.env.REACT_APP_COGNITO_ID_TOKEN));
    // console.log(decoded)
    // console.log( new Date(decoded.exp * 1000) );

    // TODO: Check refresh token expiration. If expired, redirect to login.

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
		<div>
			Welcome!
		</div>
	)
}

export default Home;
