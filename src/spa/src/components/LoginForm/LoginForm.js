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

import { AuthContext } from '../../utils/AuthProvider';

function useAuth() {
  return React.useContext(AuthContext);
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

  const onClick = (event) => {
    event.preventDefault();

    setButtonLoading(true);
    setDisableButton(true);

    const loginDetails = {
      email : state.email,
      password : state.password,
    }

    auth.onLogin(loginDetails, (err) => {
      if(!err) {
        // Send them back to the page they tried to visit when they were
        // redirected to the login page. Use { replace: true } so we don't create
        // another entry in the history stack for the login page.  This means that
        // when they get to the protected page and click the back button, they
        // won't end up back on the login page, which is also really nice for the
        // user experience.
        navigate(from, { replace: true });
      } else {
        setAlertContent(err.message || JSON.stringify(err));
        setAlert(true);
  
        setButtonLoading(false);
        setDisableButton(false);
      }
    });
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
