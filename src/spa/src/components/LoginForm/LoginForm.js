import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'

import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';

import { DemoAuthContext, DemoAuthProvider } from '../../utils/DemoAuthProvider';
import LoginCognitoUser from '../../utils/LoginCognitoUser'

function useAuth() {
  return React.useContext(DemoAuthContext);
}

function LoginForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  const from = location.state?.from?.pathname || '/';

  const [state , setState] = useState({
    email : '',
    password : '',
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
  const [disabled, setDisableButton] = React.useState(false);
  const [loading, setButtonLoading] = React.useState(false);

  // Alert Box
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');

  // const awsCognitoLogin = (p) => { // this is like handleLogin in DemoAuthProvider

  //   const loginDetails={
  //     'Username' : p.email,
  //     'Password' : p.password,
  //   }

  //   LoginCognitoUser(loginDetails) // this is the same as AuthProvider
  //     .then(tokenSet => {
  //       localStorage.setItem(process.env.REACT_APP_COGNITO_REFRESH_TOKEN, tokenSet.getIdToken().getJwtToken());
  //       // setToken(tokenSet.getIdToken().getJwtToken())
  //       setState(prevState => ({
  //         ...prevState,
  //         'successMessage' : "Authentication successful."
  //       }))
  //       navigate(from, { replace: true });
  //     })
  //     .catch(err => {
  //       console.log("hit the error in LoginCognitoUser")
  //       setAlertContent(err.message || JSON.stringify(err));
  //       setAlert(true);

  //       setButtonLoading(false);
  //       setDisableButton(false);
  //     });
  // }

  const onClick = (event) => {
    event.preventDefault();

    setButtonLoading(true);
    setDisableButton(true);

    const loginProps={
      loginDetails : {
        'Username' : state.email,
        'Password' : state.password,
      },
      from : from,
    }

    // auth.onLogin(loginProps)
    // auth.onLogin(loginProps, () => {
    auth.signin(loginProps, () => {
      console.log("I hit the callback!")
      navigate(from, { replace: true });
    });

    // awsCognitoLogin({
    //   email: state.email, 
    //   password: state.password,
    // });
  }
  return(
    <Box
      component='form'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > :not(style)': { m: 1, width: '35ch' },
      }}
      noValidate
      autoComplete='off'
    >
      <TextField
        id='email'
        label="E-mail"
        variant='standard'
        required
        type='email'
        value={state.email}
        onChange={handleChange}
      />
      <TextField
          id='password'
          label="Password"
          variant='standard'
          required
          type='password'
          value={state.password}
          onChange={handleChange}
      />
      <LoadingButton
        style={{maxWidth: '100px', minWidth: '100px'}}
        onClick={onClick}
        loading={loading}
        disabled={disabled}
        variant='outlined'
        type='submit'
      >
        Login
      </LoadingButton>
      <Collapse in={alert}>
        <Alert
          severity='error'
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={() => {
                setAlert(false);
              }}
            >
              <CloseIcon fontSize='inherit' />
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
        Don't have an account?
        <Link
          component='button'
          underline='none'
          sx={{
            ml: '10px',
          }}
          onClick={() => navigate('/register')}
        >
          Register here
        </Link>
      </Box>
    </Box>
  )
}
export default LoginForm;
