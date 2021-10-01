import React,{ useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import {
  COGNITO_ID_TOKEN,
  // COGNITO_ACCESS_TOKEN,
} from '../../constants/cognito';
import logo from '../../images/salmoncow.png';

function Home(props) {
	useEffect(() => {
		console.log(localStorage.getItem(COGNITO_ID_TOKEN))

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

	function redirectToLogin() {
		props.history.push('/login');
	}

	return(
		<div className="mt-2">
			<img src={logo} className="App-logo" alt="logo" />
		</div>
	)
}

export default withRouter(Home);