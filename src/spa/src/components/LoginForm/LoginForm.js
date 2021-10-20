import React, {useState} from 'react';
import './LoginForm.css';
import {
  COGNITO_USER_POOL_ID,
  COGNITO_CLIENT_ID,
  COGNITO_ID_TOKEN,
  COGNITO_ACCESS_TOKEN,
  COGNITO_IDENTITY_POOL_ID,
  AWS_REGION,
} from '../../constants/cognito';
import { withRouter } from "react-router-dom";
import * as AWS from 'aws-sdk/global';

function LoginForm(props) {
  const [state , setState] = useState({
    email : "",
    password : "",
    successMessage: null
  })

  const handleChange = (e) => {
    const {id , value} = e.target   
    setState(prevState => ({
      ...prevState,
      [id] : value
    }))
  }

  const handleSubmitClick = (e) => {
    e.preventDefault();
    const payload={
      "Username" : state.email,
      "Password" : state.password,
    }

    // use case 4: https://docs.aws.amazon.com/cognito/latest/developerguide/authentication.html
    const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(payload);
    const poolData = {
      UserPoolId: COGNITO_USER_POOL_ID,
      ClientId: COGNITO_CLIENT_ID,
    }
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
      Username: state.email,
      Pool: userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        const accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.getIdToken().getJwtToken();

        // setState(prevState => ({
        //   ...prevState,
        //   'successMessage' : 'Login successful. Redirecting to home page..'
        // }))
        // localStorage.setItem(COGNITO_ID_TOKEN,idToken); //TODO: store in httpOnly cookie
        // localStorage.setItem(COGNITO_ACCESS_TOKEN,accessToken); //TODO: store in httpOnly cookie

        // redirectToHome();
        // props.showError(null)
    
        AWS.config.region = AWS_REGION;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
          Logins: {
            ['cognito-idp.' + AWS_REGION + '.amazonaws.com/' + COGNITO_USER_POOL_ID]: result
              .getIdToken()
              .getJwtToken(),
          },
        });
    
        //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
        AWS.config.credentials.refresh(error => {
          if (error) {
            console.error(error);
          } else {
            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();
            setState(prevState => ({
              ...prevState,
              'successMessage' : 'Login successful. Redirecting to home page..'
            }))
            localStorage.setItem(COGNITO_ID_TOKEN, idToken); //TODO: store in httpOnly cookie
            localStorage.setItem(COGNITO_ACCESS_TOKEN, accessToken); //TODO: store in httpOnly cookie
    
            redirectToHome();
            props.showError(null)
          }
        });
      },
    
      onFailure: function(err) {
        props.showError(err.message || JSON.stringify(err));
      },
    });
  }

  const redirectToHome = () => {
    props.updateTitle('Home')
    props.history.push('/home');
  }

  const redirectToRegister = () => {
    props.history.push('/register'); 
    props.updateTitle('Register');
  }

  return(
    <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
      <form>
        <div className="form-group text-left">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input type="email" 
            className="form-control" 
            id="email" 
            aria-describedby="emailHelp" 
            placeholder="Enter email" 
            value={state.email}
            onChange={handleChange}
          />
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="form-group text-left">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" 
            className="form-control" 
            id="password" 
            placeholder="Password"
            value={state.password}
            onChange={handleChange} 
          />
        </div>
        <div className="form-check">
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
          onClick={handleSubmitClick}
        >Submit</button>
      </form>
      <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
        {state.successMessage}
      </div>
      <div className="registerMessage">
        <span>Dont have an account? </span>
        <span className="loginText" onClick={() => redirectToRegister()}>Register</span> 
      </div>
    </div>
  )
}

export default withRouter(LoginForm);