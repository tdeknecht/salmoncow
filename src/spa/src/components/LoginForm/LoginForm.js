import React, {useState} from 'react';
import { withRouter } from 'react-router-dom';
import LoginCognitoUser from '../../utils/LoginCognitoUser'

import AlertComponent from '../../components/AlertComponent/AlertComponent';

import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

function LoginForm(props) {
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
  const [disabled, setDisableButton] = React.useState(false); //https://sebhastian.com/react-disable-button/
  const [loading, setButtonLoading] = React.useState(false);

  // Alert Box
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');

  const awsCognitoLogin = (p) => {
    const loginDetails={
      'Username' : p.email,
      'Password' : p.password,
    }

    LoginCognitoUser(loginDetails)
      .then(tokenSet => {
        localStorage.setItem(process.env.REACT_APP_COGNITO_REFRESH_TOKEN, tokenSet.getIdToken().getJwtToken());
        setState(prevState => ({
          ...prevState,
          'successMessage' : "Authentication successful."
        }))
        redirectToHome();
      })
      .catch(err => {
        setAlertContent(err.message || JSON.stringify(err));
        setAlert(true);

        setButtonLoading(false);
        setDisableButton(false);
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

    setButtonLoading(true);
    setDisableButton(true);

    awsCognitoLogin({
      email: state.email, 
      password: state.password,
    });
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Don't have an account?
        <Button
          variant="text"
          style={{ backgroundColor: 'transparent' }}
          onClick={() => redirectToRegister()}
        >
          Register
        </Button>
      </Box>
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
    </Box>
  )
}
export default withRouter(LoginForm);
