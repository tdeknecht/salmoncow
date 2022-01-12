import React, {useState} from 'react';
import './LoginForm.css';
import { withRouter } from "react-router-dom";
import * as AWS from 'aws-sdk/global';
import LoaderButton from "../LoaderButton/LoaderButton"

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

  // Login Button
  const [disableButton, setDisableButton] = React.useState(false); //https://sebhastian.com/react-disable-button/
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  // https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js#setup
  const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
  const poolData = {
    UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
  }
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  // Use case 4. Authenticating a user and establishing a user session with the Amazon Cognito Identity service.
  const awsCognitoLogin = (p) => {
    const payload={
      "Username" : p.email,
      "Password" : p.password,
    }
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(payload);

    const userData = {
      Username: p.email,
      Pool: userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        const idToken = result.getIdToken().getJwtToken();
        localStorage.setItem(process.env.REACT_APP_COGNITO_ID_TOKEN, idToken);
    
        AWS.config.region = process.env.REACT_APP_AWS_REGION;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
          Logins: {
            ['cognito-idp.' + process.env.REACT_APP_AWS_REGION + '.amazonaws.com/' + process.env.REACT_APP_COGNITO_USER_POOL_ID] : result.getIdToken().getJwtToken(),
          },
        });
    
        // refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
        AWS.config.credentials.refresh(err => {
          if (err) {
            props.showError(err.message || JSON.stringify(err))
            console.error(err);
          } else {

            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();

            setState(prevState => ({
              ...prevState,
              'successMessage' : 'Login successful. Redirecting to home page...'
            }))
            redirectToHome();
            props.showError(null)
          }
        });
      },
    
      onFailure: function(err) {
        props.showError(err.message || JSON.stringify(err));
        setIsButtonLoading(false);
        setDisableButton(false);
      },
    });
  }

  const redirectToHome = () => {
    props.updateTitle('Home')
    props.history.push('/');
  }

  const redirectToRegister = () => {
    props.updateTitle('Register');
    props.history.push('/register'); 
  }

  const onClick = (e) => {
    e.preventDefault();

    setIsButtonLoading(true);
    setDisableButton(true);

    awsCognitoLogin({
      email: state.email, 
      password: state.password,
    });
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
        <LoaderButton
          onClick={onClick}
          isLoading={isButtonLoading}
          disableButton={disableButton}
        >
          Login
        </LoaderButton>
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
