import React,{ useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import {ACCESS_TOKEN_NAME} from '../../constants/cognito';
import logo from '../../images/salmoncow.png';

function Home(props) {
	useEffect(() => {
		console.log(localStorage.getItem(ACCESS_TOKEN_NAME))

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