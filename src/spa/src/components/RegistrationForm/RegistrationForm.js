import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha';

import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';

import LoginCognitoUser from '../../utils/LoginCognitoUser'

function RegistrationForm(props) {
  const navigate = useNavigate()

  const [state, setState] = useState({
    email : '',
    password : '',
    confirmPassword : ''
  })

  const handleChange = (e) => {
    const {id , value} = e.target   
    setState(prevState => ({
      ...prevState,
      [id] : value
    }))
  }

  // Registration Button
  const [disabled, setDisableButton] = React.useState(false);
  const [loading, setButtonLoading] = React.useState(false);

  // Alert Box
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');

  const recaptchaRef = React.createRef();

  const awsCognitoSignUp = (p) => {
    // https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js#setup
    const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
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

  const onClick = (e) => {
    e.preventDefault();

    setButtonLoading(true);
    setDisableButton(true);

    const recaptchaToken = recaptchaRef.current.getValue();

    if (recaptchaToken === '') {
      setAlertContent("Are you a robot?");
      setAlert(true);

      setButtonLoading(false);
      setDisableButton(false);
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
        LoginCognitoUser({'Username':state.email, 'Password':state.password})
        .then(tokenSet => {
          localStorage.setItem(process.env.REACT_APP_COGNITO_REFRESH_TOKEN, tokenSet.getIdToken().getJwtToken());
          setState(prevState => ({
            ...prevState,
            'successMessage' : "Authentication successful."
          }))
          navigate('/protected');

          // confirmUser(result.user); // confirm user via email. Needs to happen after registration+authentication
        })
        .catch(err => {
          setAlertContent(err.message || JSON.stringify(err));
          setAlert(true);

          setButtonLoading(false);
          setDisableButton(false);
        });
      })
      .catch(err => {
        if (err.name === 'UserLambdaValidationException') {
          setAlertContent(err.message.replace("PreSignUp failed with error ","") || JSON.stringify(err))
          setAlert(true);

          setButtonLoading(false);
          setDisableButton(false);
        } else {
          setAlertContent(err.message || JSON.stringify(err));
          setAlert(true);

          setButtonLoading(false);
          setDisableButton(false);
        }
      });
    } else {
      setAlertContent("Passwords do not match");
      setAlert(true);

      setButtonLoading(false);
      setDisableButton(false);
    }
  }

  return(
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > :not(style)': { m: 1, width: '35ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="email"
        label="E-mail"
        variant="standard"
        required
        type="email"
        value={state.email}
        onChange={handleChange}
      />
      <TextField
          id="password"
          label="Password"
          variant="standard"
          required
          type="password"
          value={state.password}
          onChange={handleChange}
      />
      <TextField
          id="confirmPassword"
          label="Confirm Password"
          variant="standard"
          required
          type="password"
          value={state.confirmPassword}
          onChange={handleChange}
      />
      <div className='Re-captcha'>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
        />
      </div>
      <LoadingButton
        style={{maxWidth: '100px', minWidth: '100px'}}
        onClick={onClick}
        loading={loading}
        disabled={disabled}
        variant='outlined'
        type='submit'
      >
        Register
      </LoadingButton>
      <Collapse in={alert}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alertContent}
        </Alert>
      </Collapse>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Already have an account?
        <Link
          component='button'
          underline='none'
          sx={{
            ml: '10px',
          }}
          onClick={() => navigate('/login')}
        >
          Login here
        </Link>
      </Box>
    </Box>
  )
}
export default RegistrationForm;
