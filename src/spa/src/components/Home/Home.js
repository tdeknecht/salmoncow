import React,{ useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import {
  AWS_REGION,
  COGNITO_ID_TOKEN,
  COGNITO_USER_POOL_ID,
} from '../../constants/cognito';
import logo from '../../images/salmoncow.png';
import jwt_decode from "jwt-decode";

function Home(props) {
	useEffect(() => {
		// https://github.com/auth0/jwt-decode
		const decodedHeader = jwt_decode(localStorage.getItem(COGNITO_ID_TOKEN), { header: true });
		console.log(decodedHeader);

		const decoded = jwt_decode(localStorage.getItem(COGNITO_ID_TOKEN));
		console.log(decoded)

    // TODO: Verify JWT, else redirectToLogin()
    // https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
    const xmlHttp = new XMLHttpRequest();
    const cognitoPublicUrl = ['https://cognito-idp.' + AWS_REGION + '.amazonaws.com/' + COGNITO_USER_POOL_ID + '/.well-known/jwks.json']
    xmlHttp.open("GET", cognitoPublicUrl);
    xmlHttp.send();
    xmlHttp.onreadystatechange = function() {
      if(this.readyState===4 && this.status===200) {
        console.log(xmlHttp.responseText);
      }
    }

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