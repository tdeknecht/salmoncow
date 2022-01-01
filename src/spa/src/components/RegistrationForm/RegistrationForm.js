import React, {useState} from 'react';
import { withRouter } from 'react-router-dom';
import './RegistrationForm.css';
import ReCAPTCHA from 'react-google-recaptcha';
import LoaderButton from "../LoaderButton/LoaderButton"

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

  // Registration Button
  const [disableButton, setDisableButton] = React.useState(false); //https://sebhastian.com/react-disable-button/
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const recaptchaRef = React.createRef();

  // https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js#setup
  const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
  const poolData = {
    UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
  }
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  // Use case 1. Registering a user with the application.
  const awsCognitoSignUp = (p) => {
    const attributes = [
      // { Name: 'name', Value: formData.name }
    ]
    userPool.signUp(p.email, p.password, attributes, p.validationData, function(
      err,
      result,
    ) {
      if (err) {
        if (err.name === 'UserLambdaValidationException') {
          props.showError(err.message.replace('PreSignUp failed with error ','') || JSON.stringify(err))
        } else {
          props.showError(err.message || JSON.stringify(err))
        }
      } else {

        const payload={
          "Username" : state.email,
          "Password" : state.password,
        }
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(payload);
        
        const userData = {
          Username: state.email,
          Pool: userPool,
        };
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: function(result) {
            const idToken = result.getIdToken().getJwtToken();
            localStorage.setItem(process.env.REACT_APP_COGNITO_ID_TOKEN, idToken); //TODO: store in httpOnly cookie

            setState(prevState => ({
              ...prevState,
              'successMessage' : 'Registration successful. Redirecting to home page...'
            }))
            redirectToHome();
            props.showError(null)
          },

          onFailure: function(err) {
            props.showError(err.message || JSON.stringify(err));
          },
        });

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

  const onClick = (e) => {
    e.preventDefault();

    setIsButtonLoading(true);
    setDisableButton(true);

    const recaptchaToken = recaptchaRef.current.getValue();

    if (recaptchaToken === "") {
      props.showError('Are you a robot?')
    } else if(state.password === state.confirmPassword) {
      awsCognitoSignUp({
        email: state.email, 
        password: state.password,
        validationData: [{
          Name: 'recaptchaToken',
          Value: recaptchaToken,
        }],
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
        <div className="Re-captcha">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
          />
        </div>
        <LoaderButton
          onClick={onClick}
          isLoading={isButtonLoading}
          disableButton={disableButton}
        >
          Register
        </LoaderButton>
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
