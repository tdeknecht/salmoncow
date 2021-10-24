import React,{ useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import {
  COGNITO_ID_TOKEN,
} from '../../constants/cognito';
import logo from '../../images/salmoncow.png';
import jwt_decode from "jwt-decode";

function Home(props) {
	useEffect(() => {
    console.log(localStorage.getItem(COGNITO_ID_TOKEN))

    // https://github.com/auth0/jwt-decode
    const decodedHeader = jwt_decode(localStorage.getItem(COGNITO_ID_TOKEN), { header: true });
    console.log(decodedHeader);
    
    const decoded = jwt_decode(localStorage.getItem(COGNITO_ID_TOKEN));
    console.log(decoded)

    //TODO: Call an API. Pass the JWT. Validate at API, return a generic 200. If 200 not returned, redirectToLogin()
    //Example:
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