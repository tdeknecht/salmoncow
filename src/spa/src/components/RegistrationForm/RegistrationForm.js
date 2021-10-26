import React, {useState} from 'react';
import { withRouter } from "react-router-dom";
import './RegistrationForm.css';
import {
  COGNITO_USER_POOL_ID,
  COGNITO_CLIENT_ID,
  COGNITO_ID_TOKEN,
} from '../../constants/cognito';

function RegistrationForm(props) {

  const [state, setState] = useState({
    email : "",
    password : "",
    confirmPassword : ""
  })

  const handleChange = (e) => {
    const {id , value} = e.target   
    setState(prevState => ({
      ...prevState,
      [id] : value
    }))
  }

  // https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js#setup
  // use case 1: Registering a user with the application
  const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
  const poolData = {
    UserPoolId: COGNITO_USER_POOL_ID,
    ClientId: COGNITO_CLIENT_ID,
  }
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  
  const awsCognitoSignUp = (formData) => {
    const attributes = [
      // { Name: 'name', Value: formData.name }
    ]
    userPool.signUp(formData.email, formData.password, attributes, null, function(
      err,
      result,
    ) {
      if (err) {
        // alert(err.message || JSON.stringify(err));
        props.showError(err.message || JSON.stringify(err));
      } else {

        // confirmUser(result.user);

        // TODO: If registration is successful authenticate user, get JWT, then redirectToHome()
        const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

        const payload={
          "Username" : state.email,
          "Password" : state.password,
        }
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
            const idToken = result.getIdToken().getJwtToken();
            localStorage.setItem(COGNITO_ID_TOKEN, idToken); //TODO: store in httpOnly cookie

            setState(prevState => ({
              ...prevState,
              'successMessage' : 'Registration successful. Redirecting to home page..'
            }))
            redirectToHome();
            props.showError(null)
          },

          onFailure: function(err) {
            props.showError(err.message || JSON.stringify(err));
          },
        });

        // setState(prevState => ({
        //   ...prevState,
        //   'successMessage' : 'Registration successful. Redirecting to home page..'
        // }))
        // redirectToHome();
        // props.showError(null)

        // confirmUser(result.user);
      }
    });
  }

  // use case 2: Confirming a registered, unauthenticated user using a confirmation code received via email
  // const confirmUser = (cognitoUser) => {
  //   const confirmCode = prompt('Confirmation code:')
  //   cognitoUser.confirmRegistration(confirmCode, true, function(err, result) {
  //     if (err) {
  //       alert(err.message || JSON.stringify(err));
  //       return;
  //     }
  //     console.log('call result: ' + result);
  //   });
  // }

  const redirectToHome = () => {
    props.updateTitle('Home')
    props.history.push('/home');
  }

  const redirectToLogin = () => {
    props.updateTitle('Login')
    props.history.push('/login'); 
  }

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if(state.password === state.confirmPassword) {
      awsCognitoSignUp({
        email: state.email, 
        password: state.password
      });
    } else {
      props.showError('Passwords do not match');
    }
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
        <div className="form-group text-left">
          <label htmlFor="exampleInputPassword1">Confirm Password</label>
          <input type="password" 
            className="form-control" 
            id="confirmPassword" 
            placeholder="Confirm Password"
            value={state.confirmPassword}
            onChange={handleChange} 
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
          onClick={handleSubmitClick}
        >
          Register
        </button>
      </form>
      <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
        {state.successMessage}
      </div>
      <div className="mt-2">
        <span>Already have an account? </span>
        <span className="loginText" onClick={() => redirectToLogin()}>Login here</span> 
      </div>
    </div>
  )
}
export default withRouter(RegistrationForm);
