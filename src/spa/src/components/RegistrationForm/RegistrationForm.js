import React, {useState} from 'react';
import { withRouter } from 'react-router-dom';
import './RegistrationForm.css';
import ReCAPTCHA from 'react-google-recaptcha';
import LoaderButton from "../LoaderButton/LoaderButton"
import LoginCognitoUser from '../../utils/LoginCognitoUser'

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

  const awsCognitoSignUp = (p) => {
    // https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js#setup
    const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
    const poolData = {
      UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
      ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
    }
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    const attributes = [
      // { Name: 'name', Value: p.name }
    ]

    return new Promise((resolve, reject) => (
      userPool.signUp(p.email, p.password, attributes, p.validationData, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      })
    ));
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
    props.history.push('/');
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
      setIsButtonLoading(false);
      setDisableButton(false);
      props.showError('Are you a robot?')
    } else if(state.password === state.confirmPassword) {
      awsCognitoSignUp({
        email: state.email, 
        password: state.password,
        validationData: [{
          Name: 'recaptchaToken',
          Value: recaptchaToken,
        }],
      })
      .then(() => {
        LoginCognitoUser({"Username":state.email, "Password":state.password})
        .then(tokenSet => {
          localStorage.setItem(process.env.REACT_APP_COGNITO_REFRESH_TOKEN, tokenSet.getIdToken().getJwtToken());
          setState(prevState => ({
            ...prevState,
            'successMessage' : 'Authentication successful.'
          }))
          redirectToHome();
          props.showError(null);

          // confirmUser(result.user); // confirm user via email. Needs to happen after registration+authentication
        })
        .catch(err => {
          props.showError(err.message || JSON.stringify(err));
          setIsButtonLoading(false);
          setDisableButton(false);
        });
      })
      .catch(err => {
        if (err.name === 'UserLambdaValidationException') {
          props.showError(err.message.replace('PreSignUp failed with error ','') || JSON.stringify(err))
          setIsButtonLoading(false);
          setDisableButton(false);
        } else {
          props.showError(err.message || JSON.stringify(err))
          setIsButtonLoading(false);
          setDisableButton(false);
        }
      });
    } else {
      props.showError('Passwords do not match');
      setIsButtonLoading(false);
      setDisableButton(false);
    }
  }

  return(
    <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
      <form> 
        <div className="form-group text-left">
          <label htmlFor="inputEmail">Email address</label>
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
          <label htmlFor="inputPassword">Password</label>
          <input type="password" 
            className="form-control" 
            id="password" 
            placeholder="Password"
            value={state.password}
            onChange={handleChange} 
          />
        </div>
        <div className="form-group text-left">
          <label htmlFor="inputPassword">Confirm Password</label>
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
